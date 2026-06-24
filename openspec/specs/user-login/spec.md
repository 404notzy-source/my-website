# user-login Specification

## Purpose
用户登录功能，含图片验证码校验，成功后签发 JWT 双令牌。

## Requirements

### Requirement: 用户登录
系统 SHALL 提供 `POST /api/auth/login` 端点，验证验证码和凭据后返回 access_token、refresh_token 和用户信息。

#### Scenario: 登录成功
- **GIVEN** 用户 "zhangsan" 已注册，密码为 "pass1234"，验证码有效
- **WHEN** 客户端发送 `POST /api/auth/login`，body 为 `{"username": "zhangsan", "password": "pass1234", "captcha_id": "abc...", "captcha_answer": "xY3k"}`
- **THEN** 系统返回 200，body 包含 access_token (30min 有效期)、refresh_token (7 天有效期)、token_type "bearer"、user 对象

#### Scenario: 密码错误
- **GIVEN** 用户 "zhangsan" 已注册，密码为 "pass1234"，验证码有效
- **WHEN** 客户端发送 `POST /api/auth/login`，password 为 "wrongpassword"
- **THEN** 系统返回 401，body 为 `{"detail": "Invalid username or password"}`

#### Scenario: 用户不存在
- **GIVEN** 用户名 "nonexistent" 未注册，验证码有效
- **WHEN** 客户端发送 `POST /api/auth/login`，username 为 "nonexistent"
- **THEN** 系统返回 401（不区分用户名不存在还是密码错误）

#### Scenario: 验证码错误或过期
- **GIVEN** 验证码已被使用或已过期
- **WHEN** 客户端发送 `POST /api/auth/login`，captcha_answer 不匹配
- **THEN** 系统返回 400，body 为 `{"detail": "Invalid or expired captcha"}`

### Requirement: JWT Token 结构
系统签发的 JWT SHALL 包含 `sub`（用户 ID）、`username`、`exp`（过期时间）、`type`（access 或 refresh）字段。

#### Scenario: access_token 载荷验证
- **GIVEN** 用户 id=1, username="zhangsan" 刚刚登录
- **WHEN** 解码 access_token 的 payload
- **THEN** `sub` 为 "1"，`username` 为 "zhangsan"，`type` 为 "access"，`exp` 约在 30 分钟后
