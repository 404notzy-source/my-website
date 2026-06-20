## Context

网站已有 Hero → Products 两个内容区，Navbar 中"联系我"指向 `#contact` 但无目标。"关于我"是第四个 UI 模块，位于产品区下方，以简洁的双栏布局展示个人信息。技术栈不变。

## Goals / Non-Goals

**Goals:**
- 左右双栏：照片（左）+ 联系方式（右）
- 下方品牌标签
- 图片懒加载
- 亮/暗双模式适配
- `id="contact"` 使 Navbar 锚点跳转生效

**Non-Goals:**
- 不做联系表单
- 不做社交媒体图标
- 不做后端 API

## Decisions

### Decision 1: 桌面端双栏 + 移动端堆叠

**选型**：
```css
flex flex-col md:flex-row items-center gap-8
```

**理由**：桌面端照片在左、文字在右；移动端照片在上、文字在下。`md:` 断点（768px）切换，与产品网格的响应式逻辑一致。

### Decision 2: 照片使用圆形容器 + border

**选型**：
```css
w-48 h-48 rounded-full object-cover border-4 border-slate-200 dark:border-gray-700
```

**理由**：圆形头像更有个人品牌感，边框在暗色模式下强化轮廓。

### Decision 3: 联系方式用纯文本展示

**选型**：`<p>` 标签展示电话号码 `13302020278`。

**理由**：用户明确排除表单，纯文本最简洁。后续若需"一键拨号"可改为 `<a href="tel:...">`。

### Decision 4: 品牌标签用胶囊样式

**选型**：
```css
inline-block px-6 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400
```

**理由**：与 CTA 按钮风格呼应，蓝色系统一品牌色。胶囊形状比矩形更柔和。

## Risks / Trade-offs

- **[照片加载失败]**：onError 替换为默认占位头像
- **[移动端信息层级]**：照片→联系方式→标签的垂直流自然合理
- **[电话号码硬编码]**：当前写死在组件中，后续可提取为 props

## Open Questions

- 是否需要"一键拨号"功能？——当前纯文本展示，后续可加 `tel:` 链接
- 照片是否需要文件上传？——当前用外部 URL 占位
