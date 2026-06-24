## Why

当前项目为纯前端 SPA，无用户体系。个人潮牌店需要用户认证基础设施——注册、登录、JWT 鉴权、用户 Profile。这是后续个性化功能（足迹记录、会员等级、订单系统）的前置依赖。

## What Changes

- **新建后端服务**：`server/` 目录，FastAPI + SQLite 3 + Alembic 数据库迁移
- **新增用户注册 API**：`POST /api/auth/register` — 用户名 + 邮箱 + 密码，密码 bcrypt 哈希存储
- **新增用户登录 API**：`POST /api/auth/login` — 验证凭据，签发 access_token + refresh_token（JWT）
- **新增 Token 刷新 API**：`POST /api/auth/refresh` — 用 refresh_token 换新 access_token
- **新增用户 Profile API**：`GET /api/users/me`（需鉴权）、`PATCH /api/users/me`（更新头像等）
- **新增浏览足迹 API**：`POST /api/products/:id/view`（记录浏览）、`GET /api/users/me/history`（查询足迹）
- **新增前端认证页面**：`/login`、`/register`、`/profile` 三个路由
- **新增 AuthContext**：全局认证状态管理，存储 token、用户信息，提供 login/logout/register 方法
- **新增路由守卫**：`/profile` 需登录才可访问，未登录重定向到 `/login`
- **新增 Axios 拦截器**：自动在请求头附加 Authorization，401 时自动尝试 refresh token

## Capabilities

### New Capabilities

- `auth-backend`: FastAPI 后端初始化 — 项目结构、SQLite 配置、Alembic 迁移、CORS 中间件、启动脚本
- `user-registration`: 用户注册 — 用户名/邮箱/密码校验、bcrypt 哈希、User 表写入、冲突检测
- `user-login`: 用户登录 — 凭据校验、JWT access_token + refresh_token 签发、Token 载荷设计
- `token-refresh`: Token 刷新 — refresh_token 验证、旧 token 失效、新 token 签发
- `user-profile`: 用户 Profile — 头像上传/更新、用户等级（基于消费/活跃度计算）、个人信息编辑
- `browse-history`: 浏览足迹 — 商品浏览记录写入、按时间倒序查询、分页
- `auth-frontend`: 前端认证集成 — `/login` `/register` `/profile` 页面、AuthContext、路由守卫、Axios 拦截器

### Modified Capabilities

- `routing`: 新增 `/login`、`/register`、`/profile` 路由；Navbar 新增"登录/注册"入口（未登录态）和"我的/退出"入口（已登录态）

## Out of Scope / NOT Doing

- ❌ 后台管理系统（Admin Panel）
- ❌ OAuth 第三方登录（Google/微信/GitHub）
- ❌ 邮箱验证 / 手机验证码
- ❌ 密码重置流程
- ❌ 用户间社交功能（关注、私信）
- ❌ 购物车与用户绑定（购物车仍为 localStorage 匿名模式）
- ❌ 订单系统
- ❌ 支付集成

## Impact

### 受影响文件（需修改）

| 文件 | 改动程度 | 说明 |
|------|----------|------|
| `package.json` | 轻 | 前端新增 `axios` 依赖 |
| `src/App.tsx` | 中 | 新增 AuthProvider + 3 条路由 |
| `src/components/Navbar.tsx` | 中 | 新增登录/注册/我的入口，登录态切换 |
| `vite.config.ts` | 轻 | 新增 dev proxy `/api` → `localhost:8000` |

### 新增文件

| 路径 | 说明 |
|------|------|
| `server/` | 后端项目根目录 |
| `server/main.py` | FastAPI 应用入口 |
| `server/config.py` | 配置管理（JWT_SECRET、DB_URL 等） |
| `server/database.py` | SQLite 连接 + Session 管理 |
| `server/models/user.py` | User 数据模型（SQLAlchemy） |
| `server/models/browse_history.py` | BrowseHistory 数据模型 |
| `server/schemas/auth.py` | 注册/登录 Request/Response Schema |
| `server/schemas/user.py` | Profile Request/Response Schema |
| `server/routers/auth.py` | /api/auth/* 路由 |
| `server/routers/users.py` | /api/users/* 路由 |
| `server/services/auth_service.py` | 认证逻辑（hash、JWT 签发/验证） |
| `server/migrations/` | Alembic 迁移脚本 |
| `server/requirements.txt` | Python 依赖 |
| `src/contexts/AuthContext.tsx` | 前端认证状态管理 |
| `src/pages/LoginPage.tsx` | 登录页 |
| `src/pages/RegisterPage.tsx` | 注册页 |
| `src/pages/ProfilePage.tsx` | 个人中心 |
| `src/services/auth.ts` | 前端 Auth API 封装 |

### 不受影响文件

| 文件 | 说明 |
|------|------|
| `src/components/ThemeProvider.tsx` | 不变 |
| `src/components/Hero.tsx` | 不变 |
| `src/components/HeroParticles.tsx` | 不变 |
| `src/components/AboutSection.tsx` | 不变 |
| `src/components/ProductCard.tsx` | 不变 |
| `src/components/FilterBar.tsx` | 不变 |
| `src/components/Pagination.tsx` | 不变 |
| `src/components/CartItem.tsx` | 不变 |
| `src/pages/LandingPage.tsx` | 不变 |
| `src/pages/ShopPage.tsx` | 不变 |
| `src/pages/ProductDetailPage.tsx` | 不变 |
| `src/pages/CartPage.tsx` | 不变 |
| `src/contexts/CartContext.tsx` | 不变 |
| `src/data/` | 不变 |
| `src/index.css` | 不变 |

### 回滚方案

1. 后端为独立目录 `server/`，删除即可完全移除后端
2. 前端 AuthContext 和 auth 页面为增量添加，回滚时删除对应文件 + 移除 App.tsx 中 AuthProvider 和 3 条路由
3. 数据库 SQLite 文件位于 `server/data/`，不影响前端
4. 所有变更在 `test-dev` 分支进行
