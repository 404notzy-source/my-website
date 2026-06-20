## Why

个人品牌站当前是一个空白项目，缺少任何面向访问者的内容展示。Hero Section 是访问者进入网站后看到的第一屏，需要在 3 秒内传达"我是谁、我做什么"，并提供明确的导航入口。现在是项目早期，Hero 作为网站的门面，应该最先落地。

## What Changes

- 新增全屏高度 Hero Section 组件，居中展示姓名、职业、一句话介绍
- 新增 CTA 按钮"查看我的项目"，点击后平滑滚动到 `#projects` 锚点
- 新增 CSS 动态渐变背景，亮色/暗色模式各一套色值
- 新增轻量 Canvas 粒子层，叠加在渐变背景之上
- 支持 `prefers-reduced-motion`：检测到该偏好时自动关闭粒子层
- 移动端适配：使用 `dvh` 兜底 + `min-h-screen` 确保全屏显示

## Capabilities

### New Capabilities

- `hero-section`: 全屏 Hero 区域，包含居中内容布局、动态渐变背景、Canvas 粒子层、CTA 锚点按钮，支持亮/暗双模式
- `theme-system`: 亮色/暗色主题切换机制。Hero 依赖此能力提供两套渐变色值，但主题系统本身作为独立的基础设施能力，不限于 Hero

### Modified Capabilities

（无——项目当前无已有 spec）

## Impact

- 受影响代码：`src/components/Hero.tsx`、`src/components/HeroParticles.tsx`、`src/components/ThemeProvider.tsx`（新建）
- 受影响依赖：需要安装 `tailwindcss`、`@tailwindcss/vite`（若尚未安装）
- 对现有功能的影响：无——项目处于初始化阶段，无已有页面或组件

---

## Out of Scope（严禁开发）

- 不做粒子动画效果以外的新动画（例如入场动画、滚动视差、鼠标交互）
- 不做导航栏（Navbar）
- 不做后端 API
- 不做 Projects Section（`#projects` 锚点目标由后续 change 实现）
- 不做粒子与鼠标交互（纯自动漂浮）
- 不做主题持久化（localStorage）——仅实现切换机制
