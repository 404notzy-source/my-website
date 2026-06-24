## ADDED Requirements

### Requirement: 品牌首页布局
LandingPage SHALL 保留现有品牌站视觉风格，Hero 区使用粒子动画背景，下方展示精选商品预览和关于我区域，CTA 按钮导向商城页。

#### Scenario: 首页完整渲染
- **GIVEN** 用户访问首页
- **WHEN** 页面加载完成
- **THEN** 系统从上到下依次展示 Hero → 精选商品预览（最多 6 件）→ 关于我

#### Scenario: CTA 导向商城
- **GIVEN** 用户在首页 Hero 区
- **WHEN** 用户点击"进入商城"按钮
- **THEN** 系统导航到 `/shop` 路径

#### Scenario: 精选商品跳转
- **GIVEN** 用户在首页精选预览区
- **WHEN** 用户点击某件商品卡片
- **THEN** 系统导航到对应 `/product/:id` 详情页

### Requirement: 精选商品预览
首页 SHALL 展示最多 6 件精选商品（按 createdAt 倒序取前 6 件），使用与商城一致的 ProductCard 组件。

#### Scenario: 精选商品默认展示
- **GIVEN** Mock API 返回至少 6 件商品数据
- **WHEN** 首页加载完成
- **THEN** 系统展示 6 件最新商品卡片

#### Scenario: 商品数据为空
- **GIVEN** Mock API 返回空数组
- **WHEN** 首页加载完成
- **THEN** 精选区域展示"暂无精选商品"占位文案

### Requirement: Hero 区内容更新
Hero 组件的 props SHALL 更新以匹配潮牌店定位。

#### Scenario: Hero 内容展示
- **GIVEN** 用户访问首页
- **WHEN** Hero 区渲染
- **THEN** 展示品牌名"大超潮牌店"、标语"潮流单品 · 品质之选"、CTA 按钮"进入商城"
