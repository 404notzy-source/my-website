# routing Specification

## Purpose
客户端路由分发、导航栏行为和页面级路由约定。

## Requirements

### Requirement: 客户端路由分发
系统 SHALL 使用 React Router HashRouter 管理页面路由，确保 GitHub Pages 静态托管环境下页面刷新不产生 404。

#### Scenario: 访问品牌首页
- **GIVEN** 用户已在站点内
- **WHEN** 用户导航到 `/` 路径
- **THEN** 系统渲染 LandingPage，包含 Hero 区和精选商品预览

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
- **WHEN** 用户导航到不存在路径
- **THEN** 系统渲染 404 提示页面，包含返回首页的链接

### Requirement: 导航栏路由集成
Navbar 组件 SHALL 支持 `<Link>` 路由跳转，SHALL 在购物车图标旁展示当前购物车商品总件数。

#### Scenario: 路由页面间跳转
- **GIVEN** 用户当前在 `/shop` 商城页
- **WHEN** 用户点击导航栏"首页"链接
- **THEN** 系统用客户端路由跳转到 `/`，页面无整页刷新

#### Scenario: 购物车徽标显示数量
- **GIVEN** 购物车中有 3 件商品
- **WHEN** 页面渲染导航栏
- **THEN** 购物车图标右上角显示数字 "3"

#### Scenario: 空购物车徽标隐藏
- **GIVEN** 购物车中无商品
- **WHEN** 页面渲染导航栏
- **THEN** 购物车图标不显示数量徽标

### Requirement: "关于我"弹窗
导航栏"关于我"SHALL 触发弹窗而非页面跳转，弹窗展示品牌名称、联系电话和二维码占位。

#### Scenario: 点击关于我
- **GIVEN** 用户在任意页面
- **WHEN** 用户点击导航栏"关于我"
- **THEN** 系统弹出居中浮窗，展示品牌名"大超潮牌店"、电话"13302020278"、二维码占位区，点击背景或 ✕ 关闭

### Requirement: 认证路由
系统 SHALL 提供 `/login`、`/register`、`/profile`、`/history` 路由，`/profile` 和 `/history` 需登录才可访问。

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
Navbar SHALL 根据登录状态切换入口：未登录显示"登录"和"注册"，已登录显示用户头像（有头像显示图片，无头像显示首字母），点击头像展开下拉（我的 / 退出）。

#### Scenario: 未登录态导航
- **GIVEN** 用户未登录
- **WHEN** Navbar 渲染
- **THEN** 导航栏显示"登录"链接（指向 `/login`）和"注册"链接（指向 `/register`），购物车图标正常显示

#### Scenario: 已登录态显示头像
- **GIVEN** 用户已登录，已上传头像
- **WHEN** Navbar 渲染
- **THEN** 导航栏显示用户头像图片（圆形），点击展开下拉菜单：`/profile` 和退出按钮

#### Scenario: 退出操作
- **GIVEN** 用户已登录
- **WHEN** 用户点击导航栏下拉中"退出"按钮
- **THEN** 系统调用 logout()，导航栏恢复未登录态，重定向到首页
