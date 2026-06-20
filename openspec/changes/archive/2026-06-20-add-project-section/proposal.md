## Why

Hero CTA 和导航栏"项目"链接都指向 `#projects`，但该目标区域尚不存在——点击后页面无响应。项目展示区是个人品牌站的核心内容，访问者需要看到作品来建立信任。现在是继 Hero 和导航栏后的第三大 UI 模块，应该尽早落地。

## What Changes

- 新增项目展示区 Section（`#projects`），位于 Hero 下方
- 响应式卡片网格：每行卡片数随视口宽度自动调整（1 → 2 → 3 列）
- 每张卡片包含：项目图片（lazy loading）、项目名称、简介、外部链接
- 卡片鼠标悬浮微特效（阴影抬升 + 轻微缩放）
- 所有项目图片使用原生 `loading="lazy"` 懒加载
- Hero CTA 和导航栏"项目"链接的锚点目标现已存在，平滑跳转生效

## Capabilities

### New Capabilities

- `project-section`: 项目展示区，响应式卡片网格布局，包含图片懒加载、悬浮微交互，支持亮/暗双模式

### Modified Capabilities

（无——Hero CTA 和 Navbar 的 `#projects` 锚点不变，只是目标区从"不存在"变为"存在"，不涉及 spec 需求变更）

## Impact

- 受影响代码：`src/components/ProjectSection.tsx`（新建）、`src/data/projects.ts`（新建 - 项目数据）、`src/App.tsx`（引入 ProjectSection）
- 对现有功能的影响：Hero CTA 和 Navbar"项目"链接现在能成功跳转到 `#projects`，此前点击无反应
- 图片资源：使用外部占位图片或项目截图 URL，不依赖后端

---

## Out of Scope（严禁开发）

- 不做项目详情页（无路由跳转）
- 不做项目搜索/筛选功能
- 不做分页（所有项目一次性渲染，图片懒加载）
- 不做后端 API（项目数据静态定义）
