## ADDED Requirements

### Requirement: 认证路由
系统 SHALL 新增 `/login`、`/register`、`/profile` 三条路由，`/profile` 需登录才可访问。

#### Scenario: 访问登录页
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/login` 路径
- **THEN** 系统渲染 LoginPage

#### Scenario: 访问注册页
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/register` 路径
- **THEN** 系统渲染 RegisterPage

#### Scenario: 已登录访问登录页重定向
- **GIVEN** 用户已登录
- **WHEN** 用户导航到 `/login` 路径
- **THEN** 系统重定向到 `/`

### Requirement: 导航栏登录态
Navbar SHALL 根据登录状态切换入口：未登录显示"登录"和"注册"，已登录显示用户名下拉（我的 / 退出）。

#### Scenario: 未登录态导航
- **GIVEN** 用户未登录
- **WHEN** Navbar 渲染
- **THEN** 导航栏显示"登录"链接（指向 `/login`）和"注册"链接（指向 `/register`），购物车图标正常显示

#### Scenario: 已登录态导航
- **GIVEN** 用户已登录，username 为 "zhangsan"
- **WHEN** Navbar 渲染
- **THEN** 导航栏显示用户名 "zhangsan" 和购物车图标（含徽标），点击用户名展开下拉：`/profile` 和退出按钮

#### Scenario: 退出操作
- **GIVEN** 用户已登录
- **WHEN** 用户点击导航栏"退出"按钮
- **THEN** 系统调用 logout()，导航栏恢复未登录态，重定向到首页
