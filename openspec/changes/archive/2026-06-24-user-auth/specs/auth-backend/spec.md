## ADDED Requirements

### Requirement: FastAPI 应用启动
系统 SHALL 提供一个可独立运行的 FastAPI 应用，监听 8000 端口，配置 CORS 允许前端来源。

#### Scenario: 服务启动
- **GIVEN** 已安装 Python 依赖
- **WHEN** 执行 `uvicorn main:app --port 8000`
- **THEN** 服务在 `http://localhost:8000` 启动，`GET /docs` 可访问 Swagger 文档

#### Scenario: CORS 配置
- **GIVEN** 前端运行在 `http://localhost:5173`
- **WHEN** 前端发起跨域 API 请求
- **THEN** 请求不被浏览器拦截，正常返回响应

### Requirement: SQLite 数据库连接
系统 SHALL 使用 SQLAlchemy 连接 SQLite 数据库，文件存储于 `server/data/app.db`。

#### Scenario: 数据库初始化
- **GIVEN** `server/data/` 目录存在
- **WHEN** FastAPI 应用启动
- **THEN** SQLAlchemy 引擎创建到 `server/data/app.db` 的连接，首次运行时自动创建表

### Requirement: Alembic 数据库迁移
系统 SHALL 使用 Alembic 管理数据库 schema 版本，支持 `alembic upgrade head` 应用迁移。

#### Scenario: 执行迁移
- **GIVEN** 已有迁移脚本
- **WHEN** 执行 `alembic upgrade head`
- **THEN** 所有未应用的迁移被按序执行，数据库 schema 更新至最新版本

#### Scenario: 自动生成迁移
- **GIVEN** SQLAlchemy 模型发生变更
- **WHEN** 执行 `alembic revision --autogenerate -m "描述"`
- **THEN** 新迁移脚本在 `alembic/versions/` 下生成
