## Why

当前网站只有 Hero Section 一个页面模块，访问者无法了解网站有哪些内容分区，也无法在分区之间导航。顶部导航栏是网站的基础骨架，提供全局导航锚点，让"首页、项目、联系我"三个核心分区一目了然，是后续添加 Projects 和 Contact Section 的前置依赖。

## What Changes

- 新增固定在页面顶部的导航栏组件 `Navbar`
- 左侧展示品牌名"大超潮牌店"（文字 Logo）
- 右侧三个导航链接：首页（`#hero`）、项目（`#projects`）、联系我（`#contact`）
- 点击导航链接时平滑滚动到对应 Section
- 导航栏背景使用 `backdrop-blur` 半透明毛玻璃效果，随页面滚动与下方内容形成层次感
- 支持亮色/暗色双模式，跟随 `ThemeProvider` 主题切换

## Capabilities

### New Capabilities

- `navigation-bar`: 固定顶部导航栏，包含品牌展示区、锚点导航链接、毛玻璃背景效果，支持亮/暗双模式

### Modified Capabilities

（无——导航栏是独立新组件，不修改已有 spec 的需求）

## Impact

- 受影响代码：`src/components/Navbar.tsx`（新建）、`src/App.tsx`（引入 Navbar）
- 对现有功能的影响：Navbar 固定在顶部，Hero Section 需确保不被遮挡（Navbar 高度约 64px，Hero 使用 `min-h-screen` + `dvh` 自然适配）
- 需为 Hero Section 添加 `id="hero"` 以支持导航锚点

---

## Out of Scope（严禁开发）

- 不做搜索功能
- 不做多级下拉菜单
- 不做用户登录和注册
- 不做移动端汉堡菜单（当前阶段：移动端保持水平排列或缩小字号）
- 不做路由切换（纯锚点导航，不使用 React Router）
