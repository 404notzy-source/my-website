## Context

网站当前 `index.html` 只有基础骨架：`<title>my-website</title>`，无 description、无 OG 标签。`robots.txt` 不存在。大部分已用语义化标签（`<nav>` / `<section>` / `<article>`），但可做一次审查确认。

## Goals / Non-Goals

**Goals:**
- `index.html` 补充 `<title>`、`<meta description>`、`<meta og:*>` 标签
- `public/robots.txt` 允许 Googlebot 全站索引
- 审查现有组件语义化 HTML 使用情况，必要时修复

**Non-Goals:**
- 不做 GA、sitemap、JSON-LD、og:image

## Decisions

### Decision 1: 使用 Vite `public/` 目录存放 robots.txt

**选型**：`public/robots.txt` → Vite 构建时自动复制到 `dist/robots.txt`。

**理由**：Vite 的 `public/` 目录是零配置静态资源根目录，`robots.txt` 属于不参与构建的静态文件。

### Decision 2: Title 使用品牌名，Description 概括网站核心内容

**选型**：
```html
<title>大超潮牌店 — 潮流单品，品质之选</title>
<meta name="description" content="大超潮牌店个人品牌站，专注潮流单品与风格雕刻。Nike、Chanel、LV、Rolex 等品牌精选。">
```

**理由**：Title 包含品牌名 + 核心价值主张，Description 在 160 字内概括内容 + 关键词（品牌名 + 品类）。

### Decision 3: OG 标签覆盖 Facebook/Twitter/LinkedIn 分享预览

**选型**：
```html
<meta property="og:title" content="大超潮牌店 — 潮流单品，品质之选">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
```

**理由**：OG 是 Facebook/LinkedIn/Discord 等社交平台的通用标准。Twitter 若不指定 card 标签，会退化为 OG。

### Decision 4: robots.txt 宽松策略

**选型**：
```
User-agent: *
Allow: /
```

**理由**：个人品牌站无敏感内容，欢迎所有搜索引擎索引。

## Risks / Trade-offs

- **[robots.txt 位置错误]**：放在 `src/` 或项目根都不会被 Vite 复制 → 必须放在 `public/` 目录
- **[Description 被截断]**：超过 160 字符可能被 Google 截断 → 控制在 150 字内

## Open Questions

- 是否需要网站 favicon？——当前已有 `/favicon.svg` 引用但文件可能不存在
- 是否需要 `og:image` 分享预览图？——当前 out-of-scope，后续可加
