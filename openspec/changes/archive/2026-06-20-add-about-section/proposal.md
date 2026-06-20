## Why

网站已有 Hero、产品展示区，但缺少个人信息展示区——访问者不知道"谁在做这件事"。Navbar 中"联系我"链接（`#contact`）尚无目标区域，点击无响应。"关于我"区域是个人品牌站的信任背书模块，放在产品展示之后，形成"看到作品→了解作者"的自然浏览流。

## What Changes

- 新增"关于我"Section（`#contact`），位于产品展示区下方
- 左右双栏布局：左侧个人照片（lazy loading），右侧联系方式（电话 13302020278）
- 下方品牌标签"大超潮牌店"
- 支持亮/暗双模式
- Navbar"联系我"链接的 `#contact` 锚点目标现已存在

## Capabilities

### New Capabilities

- `about-section`: "关于我"个人展示区，包含照片、联系方式、品牌标签，支持亮/暗双模式

### Modified Capabilities

（无——Navbar 的 `#contact` 锚点不变，只是目标区从"不存在"变为"存在"）

## Impact

- 受影响代码：`src/components/AboutSection.tsx`（新建）、`src/App.tsx`（引入 AboutSection）
- 对现有功能的影响：Navbar"联系我"链接现在能成功跳转到 `#contact`，此前点击无反应
- 图片资源：个人照片使用外部占位图（picsum），后续替换为真实照片

---

## Out of Scope（严禁开发）

- 不做联系表单（无输入框、无提交按钮）
- 不做社交媒体链接聚合
- 不做后端 API
