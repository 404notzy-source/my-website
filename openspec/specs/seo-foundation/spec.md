## Purpose

SEO 基础优化为个人品牌站提供搜索引擎可见性和社交媒体分享支持，包括 HTML meta 标签、Open Graph 协议标签、robots.txt 爬虫规则和语义化 HTML 结构。

## Requirements

### Requirement: HTML Meta 标签

系统 SHALL 在 `<head>` 中设置完整的 SEO meta 标签，包含标题、描述和 Open Graph 标签。

#### Scenario: 页面标题设置

- **GIVEN** 用户在浏览器中打开网站
- **WHEN** 页面加载完成
- **THEN** 浏览器标签页显示标题"大超潮牌店 — 潮流单品，品质之选"

#### Scenario: 搜索引擎描述标签

- **GIVEN** 搜索引擎爬虫抓取页面
- **WHEN** 爬虫解析 `<head>` 内容
- **THEN** 读取到 `<meta name="description">` 标签，内容包含品牌名和核心关键词

#### Scenario: 社交媒体分享预览

- **GIVEN** 用户在社交媒体（微信/Facebook/Twitter）中粘贴网站链接
- **WHEN** 社交平台抓取页面
- **THEN** 读取到 `og:title`、`og:description`、`og:type` 标签，生成分享卡片

#### Scenario: 缺少 meta 标签（边界场景）

- **GIVEN** 某社交平台不支持 OG 协议
- **WHEN** 该平台抓取页面
- **THEN** 退化为使用 `<title>` 和 `<meta description>` 内容，不影响基本展示

### Requirement: Robots.txt 爬虫规则

系统 SHALL 在网站根路径提供 `robots.txt` 文件，允许搜索引擎爬虫索引全站。

#### Scenario: Googlebot 访问 robots.txt

- **GIVEN** Google 爬虫首次访问网站
- **WHEN** 爬虫请求 `/robots.txt`
- **THEN** 返回文件内容 `User-agent: *` + `Allow: /`，爬虫继续索引全站

#### Scenario: robots.txt 缺失（边界场景）

- **GIVEN** robots.txt 文件未部署到服务器根路径
- **WHEN** 爬虫请求 `/robots.txt` 返回 404
- **THEN** 爬虫按默认策略正常索引（无 robots.txt 等同于允许所有）

### Requirement: 语义化 HTML

系统 SHALL 使用语义化 HTML 标签构建页面结构，提升搜索引擎对内容层次的理解。

#### Scenario: 页面结构标签审查

- **GIVEN** 搜索引擎爬虫分析页面结构
- **WHEN** 爬虫解析 DOM 树
- **THEN** 识别到 `<nav>`（导航）、`<section>`（内容分区）、`<article>`（产品卡片）、`<h1>`-`<h2>`（标题层级）

#### Scenario: 缺失标题层级（边界场景）

- **GIVEN** 某 Section 使用了 `<div>` 而非语义标签
- **WHEN** 爬虫分析页面
- **THEN** 该区域内容层次不清晰，但页面整体仍可索引
