## 1. Phase 1：基础设施 — 主题系统 + CSS 变量

- [x] 1.1 创建 `ThemeProvider.tsx`：实现 React Context，维护 `theme` 状态，暴露 `{ theme, toggleTheme }`，在 `document.documentElement` 上切换 `dark` class
- [x] 1.2 创建 `useTheme` hook：对 `useContext(ThemeContext)` 封装，Context 为 null 时抛出明确错误
- [x] 1.3 在 `index.css` 中定义 `:root` 和 `.dark` 下的 CSS 自定义属性（`--hero-gradient-from`、`--hero-gradient-to`、`--hero-gradient-via`、`--hero-gradient-angle`）
- [x] 1.4 在 `index.css` 中定义 `@keyframes hero-gradient-rotate`，旋转渐变角度；设 `scroll-behavior: smooth` 全局样式
- [x] 1.5 在 `App.tsx` 中用 `ThemeProvider` 包裹根节点，添加临时主题切换按钮验证

## 2. Phase 2：Hero 布局 — 内容 + 渐变背景

- [x] 2.1 创建 `Hero.tsx`：全屏高容器（`min-h-screen h-dvh`），flex 居中布局，绑定 CSS 渐变类名
- [x] 2.2 实现 Hero 内容区：姓名（h1）、职业（h2）、一句话介绍（p），传入占位文案
- [x] 2.3 创建 CTA 按钮：`<a href="#projects">`，样式为科技感圆角按钮，支持 `dark:` 变体
- [x] 2.4 文本宽度约束：介绍文字设 `max-w-prose`（约 60ch），适配超宽屏
- [x] 2.5 验证移动端 dvh 效果（Chrome DevTools 移动模拟）

## 3. Phase 3：Canvas 粒子层

- [x] 3.1 创建 `HeroParticles.tsx`：Canvas 组件，60 个粒子自动漂浮，边界反弹
- [x] 3.2 实现 `prefers-reduced-motion` 检测：匹配时直接 return null
- [x] 3.3 实现 Canvas 容错：`getContext('2d')` 失败时 catch 并 return null，不抛异常
- [x] 3.4 在 `Hero.tsx` 中用 `React.lazy(() => import('./HeroParticles'))` + `<Suspense fallback={null}>` 延迟加载
- [x] 3.5 验证：确认粒子层不影响首屏 FCP，文字渲染先于粒子

## 4. Phase 4：集成 + 无障碍 + 收尾

- [x] 4.1 Canvas 层添加 `aria-hidden="true"`，粒子 Canvas 设 `tabindex="-1"`
- [x] 4.2 确认 Tab 键导航：焦点路径为 CTA 按钮，不卡在粒子层
- [x] 4.3 两端主题色实际对比：亮色渐变（亮蓝→紫）vs 暗色渐变（深蓝→深紫），调整色值到视觉满意
- [x] 4.4 最终验收：对照 specs 清单逐项检查，确认所有 Scenario 通过
