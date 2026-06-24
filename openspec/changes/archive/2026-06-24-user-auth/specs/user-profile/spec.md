## ADDED Requirements

### Requirement: 获取当前用户信息
系统 SHALL 提供 `GET /api/users/me` 端点，返回当前认证用户的信息（需 Authorization header）。

#### Scenario: 获取 Profile 成功
- **GIVEN** 用户已登录，持有有效 access_token
- **WHEN** 客户端发送 `GET /api/users/me`，header 为 `Authorization: Bearer eyJ...`
- **THEN** 系统返回 200，body 包含 id、username、email、avatar_url、level、browse_count、created_at

#### Scenario: 未提供 token
- **GIVEN** 客户端未携带 Authorization header
- **WHEN** 客户端发送 `GET /api/users/me`
- **THEN** 系统返回 401，body 为 `{"detail": "Not authenticated"}`

#### Scenario: token 过期
- **GIVEN** access_token 已过期
- **WHEN** 客户端发送 `GET /api/users/me`，携带过期 token
- **THEN** 系统返回 401，body 为 `{"detail": "Token expired"}`

### Requirement: 更新用户头像
系统 SHALL 提供 `PATCH /api/users/me` 端点，允许更新 avatar_url 字段。

#### Scenario: 更新头像成功
- **GIVEN** 用户已登录
- **WHEN** 客户端发送 `PATCH /api/users/me`，body 为 `{"avatar_url": "https://example.com/avatar.jpg"}`
- **THEN** 系统更新 avatar_url，返回 200 和完整的用户信息

### Requirement: 用户等级计算
系统 SHALL 基于用户浏览足迹数量计算等级：浏览 0-19 为 1 级（青铜），20-49 为 2 级（白银），50-99 为 3 级（黄金），≥100 为 4 级（钻石）。

#### Scenario: 新用户默认为青铜
- **GIVEN** 用户刚注册，浏览足迹为 0
- **WHEN** `GET /api/users/me` 被调用
- **THEN** level 字段为 1

#### Scenario: 浏览达标升级
- **GIVEN** 用户浏览足迹达到 20 件
- **WHEN** `GET /api/users/me` 被调用
- **THEN** level 字段为 2
