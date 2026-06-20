## 1. Phase 1：Meta 标签 + robots.txt

- [x] 1.1 更新 `index.html`：`<title>` 改为"大超潮牌店 — 潮流单品，品质之选"，`<html lang="zh-CN">`，添加 `<meta name="description">`
- [x] 1.2 添加 Open Graph 标签：`og:title`、`og:description`、`og:type`、`og:url`
- [x] 1.3 创建 `public/robots.txt`：`User-agent: *` + `Allow: /`，允许 Googlebot 全站索引

## 2. Phase 2：语义化 HTML 审查 + 验收

- [x] 2.1 审查现有组件语义化标签：确认 `<nav>`（Navbar）、`<section>`（Hero/Products/About）、`<article>`（ProductCard）使用正确
- [x] 2.2 确认标题层级：`<h1>`（Hero 品牌名）→ `<h2>`（Section 标题）→ `<h3>`（卡片标题）无跳级
- [x] 2.3 Vite build 验证：确认 `robots.txt` 在 `dist/` 根目录，meta 标签在 HTML 输出中
- [x] 2.4 最终验收：对照 specs 3 个 Requirement 逐项检查
