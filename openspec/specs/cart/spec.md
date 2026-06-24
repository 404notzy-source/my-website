# cart Specification

## Purpose
TBD - created by archiving change shop-frontend. Update Purpose after archive.
## Requirements
### Requirement: 购物车商品管理
CartPage SHALL 展示已加入购物车的商品列表，支持修改数量、移除商品、显示价格汇总。购物车数据 SHALL 持久化到 localStorage。

#### Scenario: 购物车列表展示
- **GIVEN** 购物车中有 2 件不同商品
- **WHEN** 用户访问 `/cart`
- **THEN** 系统展示 2 行 CartItem，每行包含缩略图、名称、单价、数量选择器、小计、移除按钮

#### Scenario: 空购物车
- **GIVEN** 购物车为空
- **WHEN** 用户访问 `/cart`
- **THEN** 系统展示"购物车是空的"提示和"去逛逛"按钮，点击跳转到 `/shop`

### Requirement: 数量调整
用户 SHALL 能在购物车中调整商品数量，变化即时反映到总价。

#### Scenario: 增加数量
- **GIVEN** 某商品当前数量为 1
- **WHEN** 用户点击该商品数量选择器的"+"按钮
- **THEN** 数量变为 2，小计更新，汇总总价重新计算

#### Scenario: 减少数量至 0 即移除
- **GIVEN** 某商品当前数量为 1
- **WHEN** 用户点击该商品数量选择器的"-"按钮
- **THEN** 数量减为 0，该商品从购物车中移除，汇总总价更新

### Requirement: 移除商品
用户 SHALL 能从购物车中移除商品。

#### Scenario: 移除单件商品
- **GIVEN** 购物车中有 3 件商品
- **WHEN** 用户点击其中 1 件的"移除"按钮
- **THEN** 该商品消失，购物车剩余 2 件，导航栏徽标更新，总价更新

### Requirement: 价格汇总
购物车 SHALL 实时计算并展示商品总件数和总金额。

#### Scenario: 多件商品价格汇总
- **GIVEN** 购物车中有商品 A（¥1,299 × 2）和商品 B（¥599 × 1）
- **WHEN** 购物车页渲染
- **THEN** 页面底部展示"共 3 件商品，合计 ¥3,197"

### Requirement: 购物车持久化
购物车状态 SHALL 在页面刷新后从 localStorage 恢复。

#### Scenario: 刷新后恢复
- **GIVEN** 用户在购物车中有 2 件商品
- **WHEN** 用户刷新页面
- **THEN** 刷新后购物车仍保留 2 件商品，数据一致

#### Scenario: localStorage 数据损坏
- **GIVEN** localStorage 中购物车数据 JSON 格式损坏
- **WHEN** 系统初始化 CartContext
- **THEN** 系统静默降级为空购物车，页面正常渲染，不抛出异常

