## ADDED Requirements

### Requirement: 商品列表展示
ShopPage SHALL 从 Mock API 获取商品数据，以响应式网格展示 ProductCard，支持空态和加载态。

#### Scenario: 默认商品网格
- **GIVEN** Mock API 返回商品数据
- **WHEN** 用户访问 `/shop` 路径
- **THEN** 系统以响应式网格展示商品卡片，每张卡片显示图片、名称、价格、品牌标签

#### Scenario: 加载状态
- **GIVEN** Mock API 尚未返回数据（模拟延迟中）
- **WHEN** ShopPage 首次渲染
- **THEN** 系统展示骨架屏或加载指示器

#### Scenario: 空结果
- **GIVEN** 当前筛选条件匹配不到任何商品
- **WHEN** 商城页渲染
- **THEN** 系统展示"没有找到符合条件的商品"空态提示，提供"清除筛选"按钮

### Requirement: 分类筛选
系统 SHALL 提供按品牌和品类筛选商品的功能，筛选条件组合生效（AND 逻辑）。

#### Scenario: 按品类筛选
- **GIVEN** 商品数据中有多种品类的商品
- **WHEN** 用户点击分类标签"鞋"
- **THEN** 商品网格仅展示 category 为 'shoes' 的商品

#### Scenario: 组合筛选
- **GIVEN** 用户已选择品类"鞋"
- **WHEN** 用户再选择品牌"Nike"
- **THEN** 商品网格仅展示同时满足两个条件的商品

#### Scenario: 清除筛选
- **GIVEN** 用户已选择品类"鞋"和品牌"Nike"
- **WHEN** 用户再次点击已选中的品类"鞋"标签
- **THEN** 该筛选条件取消，商品列表仅按品牌"Nike"筛选

#### Scenario: 无筛选结果时的清除
- **GIVEN** 当前筛选组合下无匹配商品
- **WHEN** 页面展示空态提示
- **THEN** 系统 SHALL 提供"清除全部筛选"按钮，点击后恢复默认全部商品

### Requirement: 商品排序
系统 SHALL 提供排序选项：默认（最新）、价格从低到高、价格从高到低。

#### Scenario: 价格升序排序
- **GIVEN** 用户访问商城页
- **WHEN** 用户选择排序方式"价格: 从低到高"
- **THEN** 商品列表按 price 升序重新排列

#### Scenario: 默认排序
- **GIVEN** 用户访问商城页
- **WHEN** 页面首次加载或用户选择"最新"
- **THEN** 商品列表按 createdAt 倒序排列

### Requirement: 分页
商品列表超过每页 12 件时 SHALL 显示分页控件，支持翻页但不刷新页面。

#### Scenario: 首页分页
- **GIVEN** 当前筛选结果超过 12 件
- **WHEN** 商城页首次加载
- **THEN** 系统展示第 1 页内容和分页控件

#### Scenario: 翻页操作
- **GIVEN** 当前有第 1 页，总页数 > 1
- **WHEN** 用户点击"下一页"或具体页码
- **THEN** 商品网格更新为对应页的商品
