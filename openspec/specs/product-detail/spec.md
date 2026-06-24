# product-detail Specification

## Purpose
TBD - created by archiving change shop-frontend. Update Purpose after archive.
## Requirements
### Requirement: 商品详情展示
ProductDetailPage SHALL 从 Mock API 获取单个商品完整信息，展示大图、名称、品牌、完整描述、价格（含原价划线）、标签和加入购物车按钮。

#### Scenario: 正常加载商品详情
- **GIVEN** 商品 id 为 `nike-aj1` 的商品存在于 Mock 数据中
- **WHEN** 用户访问 `/product/nike-aj1`
- **THEN** 系统展示该商品大图、名称、品牌标签、完整描述、当前价格、加入购物车按钮

#### Scenario: 商品不存在
- **GIVEN** 商品 id 为 `nonexistent-id` 的商品不存在于 Mock 数据中
- **WHEN** 用户访问 `/product/nonexistent-id`
- **THEN** 系统展示"商品不存在"错误页面，包含返回商城的链接

#### Scenario: 原价划线展示
- **GIVEN** 商品的 originalPrice > price
- **WHEN** 商品详情页渲染
- **THEN** 系统展示划线原价、当前售价和折扣百分比

#### Scenario: 加载状态
- **GIVEN** Mock API 尚未返回数据
- **WHEN** ProductDetailPage 首次渲染
- **THEN** 系统展示详情骨架屏

### Requirement: 加入购物车
用户 SHALL 能在商品详情页选择数量后加入购物车，成功后系统 SHALL 给出反馈。

#### Scenario: 加入购物车成功
- **GIVEN** 用户位于商品详情页，购物车中尚无该商品
- **WHEN** 用户点击"加入购物车"按钮
- **THEN** 商品加入 CartContext，导航栏徽标数字 +1，页面展示"已加入购物车"反馈

#### Scenario: 重复加入累加数量
- **GIVEN** 购物车中已有该商品，数量为 1
- **WHEN** 用户再次点击"加入购物车"
- **THEN** 购物车中该商品数量 +1，不产生重复条目

#### Scenario: 加入购物车数量选择
- **GIVEN** 用户位于商品详情页
- **WHEN** 用户在数量选择器中设置数量为 3，然后点击"加入购物车"
- **THEN** 系统以数量 3 将商品加入购物车

