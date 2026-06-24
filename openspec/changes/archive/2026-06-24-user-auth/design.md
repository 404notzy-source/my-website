## Context

当前项目为纯前端 SPA（React 19 + Vite 8 + HashRouter），无后端。本次变更将首次引入后端服务，建立用户认证体系。后端与前端为独立进程，开发时通过 Vite proxy 通信，生产部署方案待后续确定。

## Goals / Non-Goals

**Goals:**
- 搭建 FastAPI + SQLite 后端项目骨架（Alembic 迁移、CORS 配置）
- 实现用户注册/登录 API，JWT 双 token 机制
- 前端集成：登录/注册/Profile 页面、AuthContext 全局状态、路由守卫
- 浏览足迹记录（前端行为触发后端写入）
- 用户等级计算（基于活跃度/消费，本次仅做浏览计数）

**Non-Goals:**
- 后台管理、OAuth、邮箱验证、密码重置
- 购物车与用户绑定
- Token 黑名单/Redis 缓存层

## Decisions

### 1. 后端项目结构：独立 `server/` 目录

```
server/
├── main.py                  # FastAPI app 入口，CORS 注册
├── config.py                # 环境变量 / 常量（JWT_SECRET, DB_URL）
├── database.py              # engine + SessionLocal + Base
├── requirements.txt         # Python 依赖
├── alembic.ini              # Alembic 配置
├── alembic/
│   └── versions/            # 迁移脚本
├── models/
│   ├── __init__.py
│   ├── user.py              # User 表
│   └── browse_history.py   # BrowseHistory 表
├── schemas/
│   ├── __init__.py
│   ├── auth.py              # RegisterRequest, LoginRequest, TokenResponse
│   └── user.py              # UserResponse, ProfileUpdateRequest
├── routers/
│   ├── __init__.py
│   ├── auth.py              # /api/auth/*
│   └── users.py             # /api/users/*
└── services/
    ├── __init__.py
    └── auth_service.py      # hash_password, verify_password, create_token, decode_token
```

**理由**: 遵从 FastAPI 社区最佳实践（分离 models/schemas/routers/services），避免单文件巨型应用。与前端 `src/` 平级，互不侵入。

### 2. JWT 双 Token 策略

| Token | 有效期 | 用途 | 存储位置 |
|-------|--------|------|----------|
| access_token | 30 min | API 鉴权（Authorization: Bearer） | 前端内存（AuthContext state） |
| refresh_token | 7 days | 换取新 access_token | localStorage |

**Token 载荷设计**:
```json
// access_token
{
  "sub": "user_id (int)",
  "username": "string",
  "exp": 1719600000,
  "type": "access"
}

// refresh_token
{
  "sub": "user_id (int)",
  "exp": 1720204800,
  "type": "refresh"
}
```

**理由**:
- access_token 短有效期限制泄露风险；refresh_token 长有效期避免频繁登录
- refresh_token 存 localStorage——前端刷新页面后仍可换取新 token（access_token 仅存内存，刷新即丢更安全）
- 类型字段 `type` 防止 token 混用

**反对方案**:
- httpOnly cookie: 增加 CSRF 复杂度，前端 SPA 分离部署时 cookie domain 配置繁琐
- 单 token 长有效期: 泄露后无法撤销

### 3. 密码哈希：bcrypt via passlib

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

cost factor 默认 12。注册时 `pwd_context.hash(password)`，登录时 `pwd_context.verify(password, hash)`。

**理由**: bcrypt 是密码哈希的工业标准，passlib 是 Python 生态的封装库，API 简洁。

### 4. 数据库：SQLite + SQLAlchemy + Alembic

```
SQLite 文件: server/data/app.db
连接字符串: sqlite:///./data/app.db
```

**理由**: SQLite 零配置，适合项目当前阶段。SQLAlchemy ORM 提供类型安全和迁移能力。后续可平滑迁移到 PostgreSQL（改连接字符串 + 少量类型调整）。

### 5. 前端 AuthContext 架构

沿用与 CartContext 相同的 Context + useReducer 模式：

```
<ThemeProvider>
  <HashRouter>
    <AuthProvider>          ← 新增
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          ...
        </Routes>
      </CartProvider>
    </AuthProvider>
  </HashRouter>
</ThemeProvider>
```

AuthContext 状态:
```typescript
interface AuthState {
  user: User | null         // 当前用户信息
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean          // 初始化验证中
}

// Actions
LOGIN_SUCCESS  → 设置 user + accessToken
LOGOUT         → 清除所有 + 移除 refresh_token
TOKEN_REFRESHED → 更新 accessToken
SET_USER       → 更新 user 字段
```

### 6. 路由守卫：ProtectedRoute 组件

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
```

**理由**: 声明式守卫，与 React Router v7 的 `<Route>` 组合使用，不入侵页面组件。

### 7. Axios 拦截器：自动注入 Token + 401 刷新

```typescript
// request interceptor
axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken()  // from AuthContext
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// response interceptor
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      const newToken = await refreshAccessToken()  // POST /api/auth/refresh
      error.config.headers.Authorization = `Bearer ${newToken}`
      return axiosInstance(error.config)
    }
    return Promise.reject(error)
  }
)
```

**理由**: 集中处理，页面组件无需手动管理 token。`_retry` 标记防止无限循环。

### 8. 用户等级算法（初版）

| 等级 | 称号 | 条件 |
|------|------|------|
| 1 | 青铜会员 | 默认（注册后） |
| 2 | 白银会员 | 浏览 ≥ 20 件商品 |
| 3 | 黄金会员 | 浏览 ≥ 50 件商品 |
| 4 | 钻石会员 | 浏览 ≥ 100 件商品 |

本次实现基于浏览足迹数量计算。后续可加入消费金额维度。

---

## 数据模型

```
┌──────────────────────────────────────────────────┐
│                     User                          │
├──────────────────────────────────────────────────┤
│  id              INTEGER   PK AUTOINCREMENT      │
│  username        VARCHAR   UNIQUE NOT NULL        │
│  email           VARCHAR   UNIQUE NOT NULL        │
│  password_hash   VARCHAR   NOT NULL               │
│  avatar_url      VARCHAR   NULL                   │
│  level           INTEGER   DEFAULT 1              │
│  created_at      DATETIME  DEFAULT now()          │
│  updated_at      DATETIME  DEFAULT now()          │
└──────────────────────┬───────────────────────────┘
                       │ 1
                       │
                       │ *
┌──────────────────────┴───────────────────────────┐
│                 BrowseHistory                     │
├──────────────────────────────────────────────────┤
│  id              INTEGER   PK AUTOINCREMENT      │
│  user_id         INTEGER   FK → User.id          │
│  product_id      VARCHAR   NOT NULL              │
│  viewed_at       DATETIME  DEFAULT now()          │
└──────────────────────────────────────────────────┘
```

## API 端点规范

### `/api/auth/register` — POST

```
Request:
{
  "username": "string (3-32 chars, alphanumeric + _)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)"
}

Response 201:
{
  "id": 1,
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "level": 1,
  "created_at": "2026-06-24T12:00:00"
}

Errors:
  409 - 用户名或邮箱已存在
  422 - 请求体校验失败
```

### `/api/auth/login` — POST

```
Request:
{
  "username": "string",
  "password": "string"
}

Response 200:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "avatar_url": null,
    "level": 1
  }
}

Errors:
  401 - 用户名或密码错误
  422 - 请求体校验失败
```

### `/api/auth/refresh` — POST

```
Request:
{
  "refresh_token": "eyJ..."
}

Response 200:
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}

Errors:
  401 - refresh_token 无效或已过期
```

### `/api/users/me` — GET (需 Authorization header)

```
Response 200:
{
  "id": 1,
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "avatar_url": null,
  "level": 1,
  "browse_count": 15,
  "created_at": "2026-06-24T12:00:00"
}

Errors:
  401 - 未提供 token 或 token 过期
```

### `/api/users/me` — PATCH (需 Authorization header)

```
Request:
{
  "avatar_url": "https://example.com/avatar.jpg (optional)"
}

Response 200: (同 GET /api/users/me)

Errors:
  401 - 未授权
  422 - 校验失败
```

### `/api/products/:id/view` — POST (需 Authorization header)

```
Request: (无 body)

Response 201:
{
  "message": "View recorded"
}

Errors:
  401 - 未授权
```

### `/api/users/me/history` — GET (需 Authorization header)

```
Query:
  page (int, default 1)
  pageSize (int, default 20)

Response 200:
{
  "items": [
    {
      "product_id": "nike-aj1-retro-high",
      "viewed_at": "2026-06-24T14:30:00"
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 20
}

Errors:
  401 - 未授权
```

## 组件层级图

```
App.tsx
└── <ThemeProvider>
    └── <HashRouter>
        └── <AuthProvider>                          ← 新建
            └── <CartProvider>
                ├── <Navbar />                       ← 改造：登录态切换
                │
                └── <Routes>
                    ├── "/" → <LandingPage />        (不变)
                    ├── "/shop" → <ShopPage />        (不变)
                    ├── "/product/:id" → <DetailPage /> (不变)
                    ├── "/cart" → <CartPage />         (不变)
                    ├── "/login" → <LoginPage />       ← 新建
                    ├── "/register" → <RegisterPage /> ← 新建
                    ├── "/profile" → <ProtectedRoute>  ← 新建
                    │                   └── <ProfilePage />
                    └── "*" → <NotFoundPage />         (不变)
```

## Risks / Trade-offs

| Risk | 缓解措施 |
|------|----------|
| SQLite 并发写入瓶颈 | 当前用户量小，后续迁移 PostgreSQL |
| refresh_token 存 localStorage 有 XSS 风险 | CSP header + 输入输出转义；后续可切 httpOnly cookie |
| 前后端分离部署复杂 | 开发阶段 Vite proxy 零配置；生产 Nginx 反向代理 |
| JWT Secret 硬编码泄露 | 通过环境变量 `JWT_SECRET` 注入；`.env` 加入 `.gitignore` |
| Alembic 初始配置容易出错 | 严格按照 Alembic 官方文档；首条迁移只创建表 |

## Open Questions

1. **头像上传**：当前设计用 `avatar_url` 字符串，不实现文件上传。后续是否需要本地文件存储或对象存储（S3/MinIO）？
2. **用户等级升级通知**：等级变化时是否需要前端提示？（当前仅静默更新）
3. **部署方案**：后端部署到何处？（VPS / Cloudflare Workers / Railway / Render）会影响 CORS 和生产环境域名配置
