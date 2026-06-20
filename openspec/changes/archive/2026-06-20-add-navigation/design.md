## Context

网站已有 Hero Section（`#hero`）、主题系统（亮/暗切换）。导航栏是第二个 UI 模块，需要固定在顶部，与现有 Hero 共存且不遮挡内容。技术栈不变：React 19 + TypeScript + Tailwind CSS v4。

## Goals / Non-Goals

**Goals:**
- 固定顶部导航栏，左侧品牌名，右侧三个锚点链接
- 背景毛玻璃效果（`backdrop-blur`），亮色/暗色各一套透明度
- 点击链接平滑滚动到目标 Section
- 响应式：桌面端水平排列，移动端缩小间距/字号（不折叠）
- 亮/暗模式自动跟随主题系统

**Non-Goals:**
- 不做搜索、下拉菜单、用户系统
- 不做移动端汉堡菜单
- 不做路由切换（纯锚点）
- 不实现 `#projects` 和 `#contact` 目标区（后续 change）

## Decisions

### Decision 1: 固定定位用 `fixed top-0` + z-index

**选型**：`<nav className="fixed top-0 inset-x-0 z-40">`，Hero 在下方正常流中。

**替代方案考虑**：
- `sticky top-0` → 依赖父容器滚动，Hero 全屏时 sticky 不生效
- `absolute` + scroll 监听 → 过度工程

**理由**：`fixed` 最直接，z-40 确保高于 Hero 内容（z-10）但低于主题切换按钮（z-50）。

### Decision 2: 毛玻璃用 Tailwind `backdrop-blur` + 半透明背景

**选型**：
```css
backdrop-blur-md bg-white/80 dark:bg-gray-950/80
```

**替代方案考虑**：
- 纯色 `bg-white dark:bg-gray-950` → 无毛玻璃层次感
- CSS `backdrop-filter` 手写 → Tailwind 内置已足够

**理由**：`backdrop-blur-md` 模糊下方内容，`/80` 透明度让渐变和粒子若隐若现，营造"浮在页面上方"的科技感层次。

### Decision 3: 锚点滚动复用浏览器原生 `scroll-behavior: smooth`

**选型**：导航链接为 `<a href="#hero">` 等，与 Hero CTA 相同策略——全局已设 `scroll-behavior: smooth`（`index.css`）。

**理由**：零 JS，与现有 CTA 锚点方案一致。如果目标 `#projects`/`#contact` 不存在，浏览器行为同 CTA——不滚动、不报错。

### Decision 4: 导航项使用 Props 驱动，便于后续扩展

**选型**：
```ts
interface NavItem {
  label: string
  href: string
}
interface NavbarProps {
  brandName: string
  items: NavItem[]
}
```

**理由**：Props 驱动让 Navbar 成为纯展示组件，导航项由父组件定义，后续添加/修改链接无需改 Navbar 代码。

### Decision 5: 移动端响应式——不折叠，缩小间距

**选型**：移动端减小 `gap`、缩小字号（`text-sm`），保持水平排列。

**理由**：3 个链接数量少，不折叠;用户明确排除下拉菜单，水平排列更简洁。后续可新增响应式改版 change 来加汉堡菜单。

### Decision 6: Hero 补充 `id="hero"`

**选型**：在 `Hero.tsx` 的 `<section>` 上添加 `id="hero"`。

**理由**：导航"首页"链接指向 `#hero`，Hero Section 需要此 id。不涉及 spec 变更——Hero 的功能需求未变，仅是添加锚点标识。

## Risks / Trade-offs

- **[固定导航遮挡内容]**：Navbar 约 64px 高，Hero 使用 `min-h-screen` 可能被遮住顶部 → Hero 本身已是全屏 flex 居中，内容不会被遮；后续内容区加 `scroll-margin-top: 64px` 或 `pt-16` 即可
- **[`#projects`/`#contact` 不存在]**：点击后无响应 → 与 CTA 按钮行为一致，后续 change 实现目标区即可，可接受
- **[毛玻璃性能]**：`backdrop-blur` 在某些低端设备上可能影响滚动帧率 → 固定导航不随滚动变化 blur 值，无持续重绘

## Open Questions

- Logo 是否需要图片？——当前用文字"大超潮牌店"，后续可替换为图片/图标
- 导航是否需要"当前激活"高亮？——MVP 不做，后续可用 IntersectionObserver 实现
