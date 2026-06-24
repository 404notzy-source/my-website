## ADDED Requirements

### Requirement: 用户注册
系统 SHALL 提供 `POST /api/auth/register` 端点，接受 username、email、password，创建用户并返回用户信息。

#### Scenario: 成功注册
- **GIVEN** 用户名和邮箱未被占用
- **WHEN** 客户端发送 `POST /api/auth/register`，body 为 `{"username": "zhangsan", "email": "a@b.com", "password": "pass1234"}`
- **THEN** 系统创建 User 记录，密码 bcrypt 哈希存储，返回 201 和用户信息（id, username, email, level: 1）

#### Scenario: 用户名已存在
- **GIVEN** 用户名 "zhangsan" 已被注册
- **WHEN** 客户端发送 `POST /api/auth/register`，username 为 "zhangsan"
- **THEN** 系统返回 409，body 为 `{"detail": "Username already exists"}`

#### Scenario: 邮箱已存在
- **GIVEN** 邮箱 "a@b.com" 已被注册
- **WHEN** 客户端发送 `POST /api/auth/register`，email 为 "a@b.com"
- **THEN** 系统返回 409，body 为 `{"detail": "Email already exists"}`

#### Scenario: 请求校验失败
- **GIVEN** 请求体缺少必填字段
- **WHEN** 客户端发送 `POST /api/auth/register`，password 字段为空
- **THEN** 系统返回 422，body 包含校验错误详情
