# browse-history Specification

## Purpose
TBD - created by archiving change user-auth. Update Purpose after archive.
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

