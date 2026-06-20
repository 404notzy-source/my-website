## Context

项目处于初始化阶段，无已有页面或组件。Hero Section 将是网站第一个落地 UI 模块。技术栈已确定：React 19 + Vite 7 + TypeScript + Tailwind CSS v4，部署于 GitHub Pages（base path `/my-website/`）。性能硬指标：首屏 < 2s。

## Goals / Non-Goals

**Goals:**
- 实现全屏 Hero，内容垂直居中，包含姓名、职业、一句话介绍、CTA 按钮
- 背景使用 CSS 动态渐变 + Canvas 粒子层双层叠加
- 亮色/暗色双模式渐变色值
- Canvas 粒子为纯自动漂浮，不响应鼠标
- 移动端视口兼容（dvh 兜底）
- `prefers-reduced-motion` 自动降级
- Canvas 粒子层使用 `React.lazy` 延迟加载，不阻塞首屏文字渲染

**Non-Goals:**
- 不做粒子动画之外的任何动画效果
- 不做导航栏
- 不做后端 API
- 不做 `#projects` 目标区
- 不做主题持久化（localStorage）
- 不做粒子与鼠标交互

## Decisions

### Decision 1: 渐变背景用 CSS 自定义属性 + Tailwind theme 扩展

**选型**：定义 4 个 CSS 自定义属性（`--hero-gradient-from` / `--hero-gradient-to` / `--hero-gradient-via` / `--hero-gradient-angle`），在 `:root` 和 `.dark` 下分别赋值，使用 `@keyframes` 旋转角度。

**替代方案考虑**：
- Canvas 实现渐变 → 过度工程，CSS 渐变 GPU 加速更好
- 硬编码 className 切换 → 维护两套很难扩展

**理由**：CSS 自定义属性方案零 JS 依赖，切换主题时渐变自动跟随，无需 React 状态参与。

### Decision 2: Canvas 粒子用独立组件 + React.lazy 延迟加载

**选型**：`HeroParticles.tsx` 作为独立 Canvas 组件，在 `Hero.tsx` 中用 `React.lazy(() => import('./HeroParticles'))` + `<Suspense fallback={null}>` 加载。

**理由**：
- Canvas 逻辑与布局逻辑分离，便于单独测试、单独降级
- lazy loading 让首屏 HTML 文字先渲染，粒子后挂载，不影响 FCP
- `<Suspense fallback={null}>` 确保加载中无空白闪烁——因为粒子层本身就是装饰性叠加

### Decision 3: 粒子行为——自动漂浮，无鼠标交互

**选型**：60 个粒子，随机初始位置和速度，在 `requestAnimationFrame` 中更新坐标，碰到边界反弹。纯装饰层，`pointer-events: none`。

**理由**：用户明确排除鼠标交互，保持实现简单，Canvas 代码量控制在 ~80 行以内。

### Decision 4: 主题切换使用 React Context + Tailwind `dark` class

**选型**：`ThemeProvider` 组件包裹应用根节点，维护 `theme: 'light' | 'dark'` 状态，通过 `useContext` 暴露 `{ theme, toggleTheme }`。在 `document.documentElement` 上 toggle `dark` class。

**替代方案考虑**：
- 纯 CSS `prefers-color-scheme` 媒体查询 → 无法手动切换
- CSS `light-dark()` 函数 → 浏览器支持尚不完整（Chrome 123+）

**理由**：Context 方案配合 Tailwind 的 `dark:` 前缀是最小化实现，不引入额外依赖。Hero 渐变通过 CSS 自定义属性自动响应 `dark` class 切换，无需感知 React Context。

### Decision 5: 锚点滚动使用浏览器原生 `scroll-behavior: smooth`

**选型**：CTA 按钮为 `<a href="#projects">`，全局 CSS 设 `scroll-behavior: smooth`。

**理由**：零 JS 依赖，浏览器原生实现，无需 `scrollIntoView()`。

### Decision 6: 移动端全屏高度使用 `h-dvh` + `min-h-screen` 兜底

**选型**：
```css
.hero-height {
  min-height: 100vh;        /* 兜底 */
  min-height: 100dvh;       /* 动态视口高度 */
}
```

**理由**：`dvh` 在移动浏览器地址栏收缩/展开时自动调整，`min-h-screen`（100vh）为不支持 dvh 的浏览器提供兜底。

## Risks / Trade-offs

- **[Canvas 被阻止]**：企业浏览器、安全插件可能禁用 Canvas（防指纹）→ `HeroParticles` 内部 try/catch `canvas.getContext('2d')`，失败时静默返回 null，不影响页面渲染
- **[移动端性能]**：低端设备 Canvas 粒子可能消耗过多 CPU → 粒子数固定 60 个，不做复杂物理模拟；`prefers-reduced-motion` 直接卸载组件
- **[dvh 兼容性]**：iOS < 15 不支持 `dvh` → `min-h-screen` 兜底保证基本可用
- **[`#projects` 锚点不存在]**：当前项目区未实现 → CTA 按钮始终渲染，点击后若目标不存在则无反馈。此风险可接受——后续 change 会实现 Projects Section

## Open Questions

- 用户的具体个人信息（姓名、职业、一句话介绍）？——使用占位文案，后续替换
- 粒子颜色是否跟随主题切换？——当前设计为单色粒子（白色半透明），暗色/亮色下均可见，暂不跟随主题
