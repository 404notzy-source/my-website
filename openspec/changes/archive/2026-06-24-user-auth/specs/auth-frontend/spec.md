## ADDED Requirements

### Requirement: AuthContext 全局状态
前端 SHALL 提供 AuthContext，管理用户认证状态（user、accessToken、isAuthenticated、loading），提供 login、logout、register、refreshToken 方法。

#### Scenario: 登录成功后状态更新
- **GIVEN** AuthContext 初始化，isAuthenticated 为 false
- **WHEN** 调用 `login(username, password)` 成功后
- **THEN** isAuthenticated 变为 true，user 对象包含用户信息，accessToken 存储于内存

#### Scenario: 退出登录
- **GIVEN** 用户已登录
- **WHEN** 调用 `logout()`
- **THEN** isAuthenticated 变为 false，user 置为 null，accessToken 清除，localStorage 中 refresh_token 被移除

#### Scenario: 页面刷新恢复登录态
- **GIVEN** 用户之前登录过，localStorage 中存有 refresh_token
- **WHEN** 浏览器刷新页面，AuthContext 初始化
- **THEN** 系统自动用 refresh_token 换取新 access_token，恢复登录态，loading 从 true 变为 false

#### Scenario: refresh_token 过期无法恢复
- **GIVEN** localStorage 中 refresh_token 已过期
- **WHEN** AuthContext 初始化尝试刷新
- **THEN** 刷新失败，isAuthenticated 为 false，loading 变为 false，不影响页面正常渲染

### Requirement: 路由守卫
系统 SHALL 提供 ProtectedRoute 组件，未登录用户访问受保护路由时重定向到 `/login`。

#### Scenario: 已登录访问 Profile
- **GIVEN** 用户已登录
- **WHEN** 导航到 `/profile`
- **THEN** 系统渲染 ProfilePage

#### Scenario: 未登录访问 Profile
- **GIVEN** 用户未登录
- **WHEN** 导航到 `/profile`
- **THEN** 系统重定向到 `/login`

### Requirement: Axios 拦截器
系统 SHALL 配置 Axios 实例，自动在请求中附加 Authorization header，并在 401 时自动尝试 refresh token 后重试。

#### Scenario: 自动附加 token
- **GIVEN** 用户已登录，accessToken 为 "eyJ..."
- **WHEN** 前端发起任意 API 请求
- **THEN** 请求 header 自动包含 `Authorization: Bearer eyJ...`

#### Scenario: 401 自动刷新重试
- **GIVEN** access_token 已过期，但 refresh_token 有效
- **WHEN** 前端发起 API 请求收到 401
- **THEN** 拦截器自动调用 `/api/auth/refresh` 获取新 token，用新 token 重试原请求，重试成功返回数据

#### Scenario: 刷新失败跳转登录
- **GIVEN** access_token 和 refresh_token 均已过期
- **WHEN** 前端发起 API 请求收到 401，且 refresh 也返回 401
- **THEN** 系统自动调用 logout()，将用户重定向到 `/login`

### Requirement: 前端页面
系统 SHALL 提供 `/login` 登录页、`/register` 注册页、`/profile` 个人中心页，均遵循 Tailwind + 暗色模式规范。

#### Scenario: 登录页表单
- **GIVEN** 用户未登录
- **WHEN** 访问 `/login`
- **THEN** 系统渲染登录表单（用户名输入框 + 密码输入框 + 提交按钮 + "去注册"链接），表单校验非空

#### Scenario: 注册页表单
- **GIVEN** 用户未登录
- **WHEN** 访问 `/register`
- **THEN** 系统渲染注册表单（用户名 + 邮箱 + 密码 + 确认密码 + 提交按钮 + "去登录"链接），校验密码一致性

#### Scenario: Profile 页展示
- **GIVEN** 用户已登录，level 为 2
- **WHEN** 访问 `/profile`
- **THEN** 系统展示用户名、邮箱、头像、等级（白银会员）、浏览足迹数量、足迹列表
