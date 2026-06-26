# browse-history Specification

## Purpose
用户商品浏览足迹的记录与展示。Profile 页点击足迹总数跳转至独立足迹详情页，展示商品名称和图片。

## Requirements

### Requirement: 记录商品浏览
系统 SHALL 提供 `POST /api/products/:id/view` 端点（需鉴权），记录当前用户对指定商品的浏览行为。

#### Scenario: 记录浏览成功
- **GIVEN** 用户已登录，商品 "nike-aj1-retro-high" 存在
- **WHEN** 客户端发送 `POST /api/products/nike-aj1-retro-high/view`
- **THEN** 系统在 BrowseHistory 表中写入一条记录（user_id、product_id、viewed_at），返回 201

#### Scenario: 重复浏览
- **GIVEN** 用户已登录
- **WHEN** 客户端对同一商品 `POST /api/products/:id/view` 两次
- **THEN** 系统写入两条独立的浏览记录（不做去重）

#### Scenario: 未登录记录浏览
- **GIVEN** 客户端未认证
- **WHEN** 客户端发送 `POST /api/products/:id/view`
- **THEN** 系统返回 401

### Requirement: 查询浏览足迹
系统 SHALL 提供 `GET /api/users/me/history` 端点（需鉴权），返回当前用户浏览历史，按时间倒序分页。

#### Scenario: 查询足迹分页
- **GIVEN** 用户已登录，浏览过 25 件商品
- **WHEN** 客户端发送 `GET /api/users/me/history?page=1&pageSize=20`
- **THEN** 系统返回 200，body 包含 items（20 条，按 viewed_at 倒序）、total: 25、page: 1、pageSize: 20

#### Scenario: 空足迹
- **GIVEN** 用户已登录但从未浏览商品
- **WHEN** 客户端发送 `GET /api/users/me/history`
- **THEN** 系统返回 200，body 包含 items: []、total: 0

### Requirement: 足迹详情页
前端 SHALL 提供 `/history` 受保护路由（需登录），展示浏览足迹列表，每条包含商品图片、名称、品牌、价格和浏览时间。

#### Scenario: 足迹页展示
- **GIVEN** 用户已登录，浏览过 3 件商品
- **WHEN** 访问 `/history`
- **THEN** 系统展示 3 条记录，每条含商品缩略图、名称、品牌、价格、浏览日期，点击可跳转到商品详情

#### Scenario: 空足迹页
- **GIVEN** 用户已登录但无浏览记录
- **WHEN** 访问 `/history`
- **THEN** 系统展示"暂无浏览记录"空态和"去逛逛"按钮，点击跳转 `/shop`

### Requirement: Profile 页足迹入口
Profile 页 SHALL 展示浏览足迹总数作为可点击卡片，点击跳转到 `/history`。

#### Scenario: 点击足迹数跳转
- **GIVEN** 用户在 Profile 页，browse_count 显示为 15
- **WHEN** 用户点击"浏览足迹"卡片
- **THEN** 系统导航到 `/history`
