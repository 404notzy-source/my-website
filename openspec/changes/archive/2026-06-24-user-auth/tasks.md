## 1. 后端项目骨架

- [ ] 1.1 创建 `server/` 目录结构（models/schemas/routers/services/alembic/data）
- [ ] 1.2 创建 `server/requirements.txt`（fastapi、uvicorn、sqlalchemy、alembic、passlib[bcrypt]、pyjwt、pydantic）
- [ ] 1.3 创建 `server/config.py`（JWT_SECRET、JWT_ALGORITHM、ACCESS_TOKEN_EXPIRE_MINUTES、REFRESH_TOKEN_EXPIRE_DAYS、DATABASE_URL）
- [ ] 1.4 创建 `server/database.py`（SQLAlchemy engine + SessionLocal + Base）
- [ ] 1.5 创建 `server/main.py`（FastAPI app、CORS 中间件、router 注册、启动事件建表）
- [ ] 1.6 安装 Python 依赖并验证 `uvicorn main:app` 可启动

**验证**: `curl http://localhost:8000/docs` 返回 Swagger 页面，`curl http://localhost:8000/api/health` 可访问（如果定义）

## 2. 数据库模型 + Alembic

- [ ] 2.1 创建 `server/models/__init__.py` + `server/models/user.py`（User 表：id, username, email, password_hash, avatar_url, level, created_at, updated_at）
- [ ] 2.2 创建 `server/models/browse_history.py`（BrowseHistory 表：id, user_id FK, product_id, viewed_at）
- [ ] 2.3 初始化 Alembic（`alembic init alembic`），配置 alembic.ini 和 env.py 指向 SQLite + SQLAlchemy Base
- [ ] 2.4 生成首条迁移 `alembic revision --autogenerate -m "init users and browse_history"`
- [ ] 2.5 执行迁移 `alembic upgrade head`，验证 `server/data/app.db` 中表已创建

**验证**: 用 `sqlite3 server/data/app.db ".schema"` 确认 User 和 BrowseHistory 表结构正确

## 3. 认证服务层

- [ ] 3.1 创建 `server/services/__init__.py` + `server/services/auth_service.py`
- [ ] 3.2 实现 `hash_password(password: str) -> str`（bcrypt）
- [ ] 3.3 实现 `verify_password(plain: str, hashed: str) -> bool`
- [ ] 3.4 实现 `create_access_token(user_id: int, username: str) -> str`（JWT，type=access，30min）
- [ ] 3.5 实现 `create_refresh_token(user_id: int) -> str`（JWT，type=refresh，7d）
- [ ] 3.6 实现 `decode_token(token: str, expected_type: str) -> dict`（验证签名 + 类型 + 过期）

**验证**: 编写简单 Python 脚本验证 hash/verify 往返正确，token decode 返回 payload

## 4. 认证 API 路由

- [ ] 4.1 创建 `server/schemas/__init__.py` + `server/schemas/auth.py`（RegisterRequest、LoginRequest、TokenResponse、RefreshRequest Pydantic models）
- [ ] 4.2 创建 `server/routers/__init__.py` + `server/routers/auth.py`
- [ ] 4.3 实现 `POST /api/auth/register`（校验冲突 → hash → insert → 返回 UserOut）
- [ ] 4.4 实现 `POST /api/auth/login`（查询用户 → verify password → 签发双 token → 返回 TokenResponse + user）
- [ ] 4.5 实现 `POST /api/auth/refresh`（校验 refresh_token type → 签发新 access_token）
- [ ] 4.6 创建 `server/dependencies.py`（get_db 依赖注入、get_current_user 鉴权依赖）

**验证**: `curl -X POST http://localhost:8000/api/auth/register -d '{"username":"test","email":"test@test.com","password":"pass1234"}'` 返回 201 + 用户信息

## 5. 用户 Profile + 足迹 API

- [ ] 5.1 创建 `server/schemas/user.py`（UserOut、ProfileUpdate、BrowseHistoryOut、HistoryListResponse）
- [ ] 5.2 创建 `server/routers/users.py`
- [ ] 5.3 实现 `GET /api/users/me`（返回当前用户信息 + browse_count）
- [ ] 5.4 实现 `PATCH /api/users/me`（更新 avatar_url）
- [ ] 5.5 实现 `POST /api/products/{product_id}/view`（写入 BrowseHistory）
- [ ] 5.6 实现 `GET /api/users/me/history`（分页查询，按 viewed_at 倒序）
- [ ] 5.7 在 `GET /api/users/me` 中实现等级计算逻辑（0-19→1, 20-49→2, 50-99→3, ≥100→4）

**验证**: 登录后调用 `GET /api/users/me` 返回 level=1；多次 POST view 后 level 随条件升级

## 6. 前端基础设施

- [ ] 6.1 安装 `axios` 依赖
- [ ] 6.2 配置 `vite.config.ts` 添加 dev proxy：`/api` → `http://localhost:8000`
- [ ] 6.3 创建 `src/services/auth.ts`（封装 register/login/refresh/me/updateProfile/postView/getHistory API 调用）
- [ ] 6.4 创建 `src/services/axios.ts`（axios 实例 + request 拦截器注入 token + response 拦截器 401 自动刷新）

**验证**: `npm run dev` 启动，Vite proxy 生效，前端 axios 调用 `/api/auth/register` 无跨域错误

## 7. AuthContext + 路由守卫

- [ ] 7.1 创建 `src/contexts/AuthContext.tsx`（useReducer 管理 user/accessToken/isAuthenticated/loading）
- [ ] 7.2 实现 `login(username, password)` → 调用 API → 存储 accessToken 到内存 + refresh_token 到 localStorage
- [ ] 7.3 实现 `register(username, email, password)` → 调用 API → 自动登录
- [ ] 7.4 实现 `logout()` → 清除状态 + 移除 localStorage refresh_token
- [ ] 7.5 实现初始化恢复逻辑：检测 localStorage refresh_token → 调用 refresh API → 恢复登录态
- [ ] 7.6 实现 `refresh_token` 过期容错（静默失败，不抛异常）
- [ ] 7.7 创建 `src/components/ProtectedRoute.tsx`（未登录重定向 /login，已登录渲染 children）

**验证**: 前端调用 AuthContext login → 状态更新 → localStorage 有 refresh_token → 刷新页面 → 自动恢复

## 8. 前端页面

- [ ] 8.1 创建 `src/pages/LoginPage.tsx`（表单：用户名+密码+提交+去注册链接，校验非空，错误提示）
- [ ] 8.2 创建 `src/pages/RegisterPage.tsx`（表单：用户名+邮箱+密码+确认密码+去登录链接，校验一致性）
- [ ] 8.3 创建 `src/pages/ProfilePage.tsx`（展示：头像、用户名、邮箱、等级标签、足迹数量、足迹列表）
- [ ] 8.4 Profile 页实现头像 URL 编辑功能（输入框 + 保存按钮）
- [ ] 8.5 所有页面遵循 Tailwind + 暗色模式规范

**验证**: 访问 `/login` 和 `/register` 可提交表单；登录后访问 `/profile` 展示用户数据

## 9. 路由 + Navbar 改造

- [ ] 9.1 更新 `src/App.tsx`：挂载 `<AuthProvider>`，新增 `/login` `/register` `/profile` 路由，`/profile` 用 ProtectedRoute 包裹
- [ ] 9.2 改造 `Navbar.tsx`：未登录态显示"登录""注册"，已登录态显示用户名 + 下拉（我的/退出）
- [ ] 9.3 实现退出登录功能（调用 logout + 重定向首页）

**验证**: 未登录 Navbar 显示登录/注册链接；登录后显示用户名；点击退出恢复未登录态

## 10. 浏览足迹前端集成

- [ ] 10.1 在 `ProductDetailPage.tsx` 中添加浏览记录调用：页面加载时调用 `POST /api/products/:id/view`（仅当用户已登录）
- [ ] 10.2 未登录用户访问详情页不调用 view API（不产生 401 错误）
- [ ] 10.3 Profile 页展示足迹列表（商品 id + 浏览时间），点击可跳转到商品详情

**验证**: 登录后访问商品详情 → Profile 页足迹列表可见该商品；未登录访问详情不报错

## 11. 集成验证

- [ ] 11.1 端到端流程：注册 → 自动登录 → Navbar 显示用户名 → 浏览商品 → Profile 显示足迹 → 刷新页面登录态恢复 → 退出登录
- [ ] 11.2 access_token 过期自动刷新流程验证（可临时将 expire 设为 1 分钟测试）
- [ ] 11.3 暗色模式检查：登录/注册/Profile 页在亮暗模式下均正常
- [ ] 11.4 响应式检查：登录/注册/Profile 页在手机/平板/桌面均正常
- [ ] 11.5 错误场景验证：重复注册 → 409、错误密码 → 401、未登录访问 /profile → 重定向 /login
