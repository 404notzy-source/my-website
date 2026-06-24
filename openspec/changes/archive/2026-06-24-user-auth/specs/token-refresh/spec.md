## ADDED Requirements

### Requirement: Token 刷新
系统 SHALL 提供 `POST /api/auth/refresh` 端点，接受有效的 refresh_token，返回新的 access_token。

#### Scenario: 刷新成功
- **GIVEN** 用户持有有效的 refresh_token（未过期，type="refresh"）
- **WHEN** 客户端发送 `POST /api/auth/refresh`，body 为 `{"refresh_token": "eyJ..."}`
- **THEN** 系统返回 200，body 包含新的 access_token 和 token_type "bearer"

#### Scenario: refresh_token 无效
- **GIVEN** 客户端提供的 token 签名无效或 type 不是 "refresh"
- **WHEN** 客户端发送 `POST /api/auth/refresh`
- **THEN** 系统返回 401，body 为 `{"detail": "Invalid refresh token"}`

#### Scenario: refresh_token 已过期
- **GIVEN** refresh_token 的 `exp` 时间已过
- **WHEN** 客户端发送 `POST /api/auth/refresh`
- **THEN** 系统返回 401，body 为 `{"detail": "Refresh token expired"}`

### Requirement: Token 类型隔离
系统 SHALL 拒绝用 access_token 调用 refresh 端点，反之亦然。

#### Scenario: access_token 调用 refresh 被拒绝
- **GIVEN** 客户端持有有效的 access_token（type="access"）
- **WHEN** 客户端发送 `POST /api/auth/refresh`，传入 access_token
- **THEN** 系统返回 401
