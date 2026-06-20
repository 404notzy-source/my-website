## Context

网站已有 Hero（`#hero`）、Navbar（固定顶部）、主题系统。Navbar 和 Hero CTA 都指向 `#projects`，但该目标不存在。项目展示区是第三个 UI 模块，位于 Hero 下方，承接 CTA 和导航的跳转流量。技术栈不变。

## Goals / Non-Goals

**Goals:**
- 响应式卡片网格，视口宽度自适应列数
- 卡片：图片（顶部）、标题、简介、链接
- 图片懒加载（`loading="lazy"`）
- 悬浮微特效（`hover:scale + hover:shadow`）
- 亮/暗双模式适配
- `id="projects"` 使锚点跳转生效

**Non-Goals:**
- 不做详情页、搜索、筛选、分页
- 不做后端 API
- 不做图片上传/管理

## Decisions

### Decision 1: 响应式网格用 Tailwind `grid` + 断点

**选型**：
```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

**替代方案考虑**：
- `flex` + 手动计算 → 过度工程
- CSS Grid `auto-fill` / `auto-fit` → 对卡片最小宽度需求不精确

**理由**：Tailwind 断点直接对应设备宽度，3 个断点覆盖移动/平板/桌面，无需 JS。

### Decision 2: 项目数据用静态 TypeScript 文件

**选型**：`src/data/projects.ts` 导出 `Project[]` 数组。

```ts
interface Project {
  id: string
  name: string
  description: string
  imageUrl: string
  link: string
}
```

**理由**：用户明确无后端 API，静态数据满足 MVP；TypeScript 提供类型安全；后续可替换为 CMS/API 而不改组件接口。

### Decision 3: 图片懒加载用浏览器原生 `loading="lazy"`

**选型**：`<img loading="lazy" src={imageUrl} />`

**理由**：零 JS 依赖，浏览器原生支持（Chrome 77+），首屏不加载 Hero 下方的图片。与项目性能指标"所有图片 lazy loading"一致。

### Decision 4: 悬浮特效用 Tailwind `hover:` 伪类 + `transform` + `transition`

**选型**：
```css
hover:scale-[1.03] hover:shadow-lg transition-all duration-300
```

**理由**：纯 CSS，GPU 加速（transform 在 compositor 层），无 JS 事件监听开销。

### Decision 5: Section 背景与 Hero 形成视觉过渡

**选型**：浅/暗纯色底 + 微妙的顶部渐变过渡。亮色 `bg-white`，暗色 `bg-gray-900`，与 Hero 的 `slate-50` / `gray-950` 形成微妙差异，暗示内容分区。

### Decision 6: 卡片采用统一圆角 + 边框风格

**选型**：
```css
rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900
```

**理由**：与 CTA 按钮的圆角风格一致，维持科技感。暗色边框线强化卡片边界。

## Risks / Trade-offs

- **[图片加载失败]**：外部图片 URL 可能失效 → 卡片不崩溃，用 `onError` 替换为占位图
- **[超长项目名/简介]**：卡片内容溢出 → `line-clamp-2` 截断简介文字
- **[项目数为 1 或 2 个]**：单列或双列显示正常，无布局异常
- **[移动端卡片过窄]**：`grid-cols-1` 保证单列满宽

## Open Questions

- 项目数据——当前使用占位数据（3 个示例项目），后续替换为真实作品
- 图片资源——使用 picsum.photos 占位图，后续替换为项目截图
