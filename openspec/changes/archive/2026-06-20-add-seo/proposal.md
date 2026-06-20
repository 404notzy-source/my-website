## Why

网站 UI 模块已基本完备（Hero、产品展示、关于我），但缺少 SEO 基础设施——HTML `<title>` 仍是默认的 `my-website`，无 meta description，无 robots.txt。搜索引擎无法正确索引，社交媒体分享时无预览信息。SEO 是个人品牌站被发现的入口，应在上线前补齐。

## What Changes

- 更新 `index.html`：设置 `<title>` 为"大超潮牌店"，添加 `<meta name="description">`
- 新增 Open Graph 标签：`og:title`、`og:description`、`og:type`，支持社交媒体分享预览
- 新增 `public/robots.txt`：允许所有爬虫（Googlebot）索引全站
- 审查并确保所有组件使用语义化 HTML 标签

## Capabilities

### New Capabilities

- `seo-foundation`: SEO 基础优化，包含 HTML meta 标签、Open Graph 社交分享标签、robots.txt、语义化 HTML 规范

### Modified Capabilities

（无——SEO 是新增基础设施层，不修改已有 spec 的行为需求）

## Impact

- 受影响代码：`index.html`（meta 标签更新）、`public/robots.txt`（新建）、现有组件语义化审查（读不改）
- 对现有功能的影响：无——纯元数据和配置文件变更，不影响任何 UI 行为
- 对部署的影响：`robots.txt` 需放置在构建输出的根目录（Vite `public/` 目录 → `dist/` 根）

---

## Out of Scope（严禁开发）

- 不做 Google Analytics / 统计代码
- 不做 sitemap.xml
- 不做 JSON-LD 结构化数据
- 不做社交媒体分享图片（og:image）
