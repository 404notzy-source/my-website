## 1. Phase 1：Navbar 组件 — 结构 + 样式

- [x] 1.1 创建 `Navbar.tsx`：定义 `NavItem` 和 `NavbarProps` 接口，实现 `fixed top-0` 布局，左侧品牌名，右侧 `items.map` 渲染导航链接
- [x] 1.2 导航链接样式：文字色 `gray-600 dark:gray-300`，hover 态 `text-blue-600 dark:text-blue-400`，`transition-colors duration-300`
- [x] 1.3 响应式适配：移动端（`sm:` 断点以下）缩小 padding 和字号，保持水平排列
- [x] 1.4 为 `Hero.tsx` 的 `<section>` 添加 `id="hero"`，确保导航"首页"锚点有效

## 2. Phase 2：毛玻璃 + 主题适配

- [x] 2.1 导航栏添加毛玻璃背景：`backdrop-blur-md bg-white/80 dark:bg-gray-950/80` + `transition-colors duration-500`
- [x] 2.2 亮色/暗色模式对比验证：亮色底 + 白毛玻璃 vs 暗色底 + 暗毛玻璃，文字对比度可读
- [x] 2.3 导航栏底部添加 `border-b border-slate-200/50 dark:border-gray-800/50` 分割线，增强层次

## 3. Phase 3：集成 + 功能验证

- [x] 3.1 在 `App.tsx` 中引入 `Navbar`，传入品牌名和导航项配置，置于 Hero 之前
- [x] 3.2 验证固定定位：滚动页面确认 Navbar 不移动
- [x] 3.3 验证锚点跳转：点击"首页"滚动到 Hero，点击"项目"/"联系我"无报错
- [x] 3.4 验证主题切换：亮↔暗切换时 Navbar 毛玻璃和文字同步过渡
- [x] 3.5 验证移动端：Chrome DevTools 移动模拟，确认水平排列、字号缩小
