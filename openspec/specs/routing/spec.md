# routing Specification

## Purpose
TBD - created by archiving change shop-frontend. Update Purpose after archive.
## Requirements
### Requirement: 客户端路由分发
系统 SHALL 使用 React Router HashRouter 管理四个独立页面路由，确保 GitHub Pages 静态托管环境下页面刷新不产生 404。

#### Scenario: 访问品牌首页
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/` 路径
- **THEN** 系统渲染 LandingPage，包含 Hero 区、精选商品预览和关于我

#### Scenario: 访问商城页
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/shop` 路径
- **THEN** 系统渲染 ShopPage，包含分类筛选栏和响应式商品网格

#### Scenario: 访问商品详情页
- **GIVEN** 商品 `nike-aj1` 存在于数据中
- **WHEN** 用户导航到 `/product/nike-aj1` 路径
- **THEN** 系统渲染 ProductDetailPage，展示对应 id 的商品完整信息

#### Scenario: 访问购物车
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/cart` 路径
- **THEN** 系统渲染 CartPage，展示已添加的商品列表和价格汇总

#### Scenario: 访问未定义路由
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到不存在路径（如 `/admin`）
- **THEN** 系统渲染 404 提示页面，包含返回首页的链接

### Requirement: 导航栏路由集成
Navbar 组件 SHALL 同时支持 `<Link>` 路由跳转和锚点跳转，SHALL 在购物车图标旁展示当前购物车商品总件数。

#### Scenario: 路由页面间跳转
- **GIVEN** 用户当前在 `/shop` 商城页
- **WHEN** 用户点击导航栏"首页"链接
- **THEN** 系统用客户端路由跳转到 `/`，页面无整页刷新

#### Scenario: 锚点跳转仍可用
- **GIVEN** 用户当前在首页 `/`
- **WHEN** 用户点击导航栏"关于我"链接（href="#contact"）
- **THEN** 页面平滑滚动到 AboutSection 区域

#### Scenario: 购物车徽标显示数量
- **GIVEN** 购物车中有 3 件商品
- **WHEN** 页面渲染导航栏
- **THEN** 购物车图标右上角显示数字 "3"

#### Scenario: 空购物车徽标隐藏
- **GIVEN** 购物车中无商品
- **WHEN** 页面渲染导航栏
- **THEN** 购物车图标不显示数量徽标

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

