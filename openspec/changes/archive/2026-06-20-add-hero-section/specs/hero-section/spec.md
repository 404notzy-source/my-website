## ADDED Requirements

### Requirement: Hero 全屏展示

系统 SHALL 在页面顶部渲染一个占据视口全高的 Hero 区域，内容在水平和垂直方向上居中。

#### Scenario: 桌面端正常渲染

- **GIVEN** 用户在桌面浏览器中打开网站
- **WHEN** 页面加载完成
- **THEN** Hero 区域占据视口 100% 高度
- **THEN** 姓名、职业、一句话介绍居中显示
- **THEN** CTA 按钮"查看我的项目"可见且可点击

#### Scenario: 移动端全屏适配

- **GIVEN** 用户在移动浏览器中打开网站
- **WHEN** 页面加载完成且浏览器地址栏可见
- **THEN** Hero 区域高度等于当前可见视口高度（dvh）
- **THEN** 内容在可见区域内垂直居中，不被地址栏遮挡

#### Scenario: 移动浏览器地址栏收缩

- **GIVEN** 用户在移动浏览器中打开网站
- **WHEN** 用户向下滚动导致浏览器地址栏收缩
- **THEN** Hero 区域高度自动适配新的视口高度

#### Scenario: 超宽屏显示（边界场景）

- **GIVEN** 用户在 21:9 或更宽屏幕上打开网站
- **WHEN** 页面加载完成
- **THEN** 一句话介绍的文本宽度不超过 60ch，保持可读性

### Requirement: CTA 按钮锚点跳转

CTA 按钮 SHALL 使用浏览器原生平滑滚动跳转到 `#projects` 锚点。

#### Scenario: 点击 CTA 按钮

- **GIVEN** 用户在 Hero 区域
- **WHEN** 用户点击"查看我的项目"按钮
- **THEN** 页面平滑滚动到 `#projects` 区域

#### Scenario: `#projects` 锚点不存在（边界场景）

- **GIVEN** 页面上不存在 `id="projects"` 的元素
- **WHEN** 用户点击"查看我的项目"按钮
- **THEN** 页面不发生滚动，且不抛出异常

### Requirement: CSS 动态渐变背景

系统 SHALL 使用 CSS 自定义属性驱动的渐变背景，亮色和暗色模式下分别使用不同的渐变色值，渐变角度随时间自动旋转。

#### Scenario: 亮色模式渐变

- **GIVEN** 当前主题为亮色模式
- **WHEN** 页面加载完成
- **THEN** Hero 背景显示从亮蓝到紫色的渐变
- **THEN** 渐变角度持续缓慢旋转

#### Scenario: 暗色模式渐变

- **GIVEN** 当前主题为暗色模式
- **WHEN** 页面加载完成
- **THEN** Hero 背景显示从深蓝到深紫的渐变
- **THEN** 渐变角度持续缓慢旋转

#### Scenario: 渐变角度动画不阻塞渲染

- **GIVEN** 页面使用 CSS `@keyframes` 实现渐变角度旋转
- **WHEN** 动画运行中
- **THEN** 动画使用 `transform: rotate()` 或 `@property` + `background` 实现，不触发 layout/paint 重排

### Requirement: Canvas 粒子层

系统 SHALL 在渐变背景之上叠加一个 Canvas 粒子层，粒子自动漂浮移动，不响应鼠标。

#### Scenario: 粒子正常渲染

- **GIVEN** 用户浏览器支持 Canvas 且未设置 `prefers-reduced-motion`
- **WHEN** 页面加载完成
- **THEN** 约 60 个半透明粒子在 Hero 区域内漂浮
- **THEN** 粒子层不拦截鼠标事件（pointer-events: none）

#### Scenario: 无障碍偏好降级

- **GIVEN** 用户操作系统设置了"减少动效"（`prefers-reduced-motion: reduce`）
- **WHEN** 页面加载完成
- **THEN** Canvas 粒子层不被渲染
- **THEN** Hero 仅显示 CSS 渐变背景

#### Scenario: Canvas 被浏览器阻止（边界场景）

- **GIVEN** 浏览器因安全策略阻止 Canvas API
- **WHEN** 页面加载完成
- **THEN** 粒子组件静默失败，不抛出异常
- **THEN** Hero 仅显示 CSS 渐变背景，内容正常可读

#### Scenario: 粒子层延迟加载

- **GIVEN** 用户浏览器支持 Canvas
- **WHEN** 页面首次加载
- **THEN** Hero 文字内容先于粒子层渲染
- **THEN** 粒子层挂载过程不阻塞首屏内容展示

### Requirement: 键盘和无障碍访问

Hero 区域 SHALL 对键盘导航和屏幕阅读器友好。

#### Scenario: Tab 键导航跳过粒子层

- **GIVEN** 用户使用键盘 Tab 导航
- **WHEN** 用户从页面顶部开始按 Tab
- **THEN** 焦点直接到达 CTA 按钮，不会卡在 Canvas 粒子元素上

#### Scenario: 屏幕阅读器读取 Hero 内容

- **GIVEN** 用户使用屏幕阅读器
- **WHEN** 阅读器解析 Hero 区域
- **THEN** 姓名、职业、介绍、CTA 按钮均被正确读取
- **THEN** Canvas 粒子层对屏幕阅读器不可见
