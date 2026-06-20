## 1. Phase 1：数据层 + 卡片组件

- [x] 1.1 创建 `src/data/projects.ts`：定义 `Project` 接口（id, name, description, imageUrl, link），导出 3 个占位项目数据
- [x] 1.2 创建 `ProjectCard.tsx`：卡片布局（图/标题/简介/链接），`rounded-xl border`，`hover:scale-[1.03] hover:shadow-lg transition-all duration-300`
- [x] 1.3 图片懒加载：`<img loading="lazy">` + `onError` 替换占位图，简介用 `line-clamp-2` 截断

## 2. Phase 2：项目展示区 + 响应式网格

- [x] 2.1 创建 `ProjectSection.tsx`：Section 标题"我的项目"，`id="projects"`，`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- [x] 2.2 亮/暗模式适配：背景 `bg-white dark:bg-gray-900`，卡片 `bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800`
- [x] 2.3 验证响应式：桌面 3 列 / 平板 2 列 / 移动 1 列

## 3. Phase 3：集成 + 验收

- [x] 3.1 在 `App.tsx` 中引入 `ProjectSection`，置于 Hero 之后
- [x] 3.2 验证 Hero CTA 按钮点击后平滑滚动到 `#projects`
- [x] 3.3 验证导航栏"项目"链接跳转到 `#projects`
- [x] 3.4 验证悬浮微特效 + 图片懒加载
- [x] 3.5 最终验收：对照 specs 5 个 Requirement 逐项检查
