# user-registration Specification

## Purpose
用户注册功能，含图片验证码校验，注册成功后自动签发 JWT 令牌实现无感登录。

## Requirements

### Requirement: 用户注册
系统 SHALL 提供 `POST /api/auth/register` 端点，接受 username、email、password、captcha_id、captcha_answer，验证验证码后创建用户并返回 JWT Token。

#### Scenario: 成功注册
- **GIVEN** 用户名和邮箱未被占用，验证码有效
- **WHEN** 客户端发送 `POST /api/auth/register`，body 为 `{"username": "zhangsan", "email": "a@b.com", "password": "pass1234", "captcha_id": "abc...", "captcha_answer": "xY3k"}`
- **THEN** 系统创建 User 记录，密码 bcrypt 哈希存储，返回 201 和 TokenResponse（access_token + refresh_token + user 对象）

#### Scenario: 用户名已存在
- **GIVEN** 用户名 "zhangsan" 已被注册
- **WHEN** 客户端发送 `POST /api/auth/register`，username 为 "zhangsan"
- **THEN** 系统返回 409，body 为 `{"detail": "Username already exists"}`

#### Scenario: 邮箱已存在
- **GIVEN** 邮箱 "a@b.com" 已被注册
- **WHEN** 客户端发送 `POST /api/auth/register`，email 为 "a@b.com"
- **THEN** 系统返回 409，body 为 `{"detail": "Email already exists"}`

#### Scenario: 验证码错误或过期
- **GIVEN** 验证码已被使用或已过期（5 分钟 TTL）
- **WHEN** 客户端发送 `POST /api/auth/register`，captcha_answer 不匹配
- **THEN** 系统返回 400，body 为 `{"detail": "Invalid or expired captcha"}`

#### Scenario: 请求校验失败
- **GIVEN** 请求体缺少必填字段
- **WHEN** 客户端发送 `POST /api/auth/register`，password 字段为空
- **THEN** 系统返回 422，body 包含校验错误详情
