## 1. 基础设施搭建

- [ ] 1.1 安装 `react-router-dom` 依赖，确认与 Vite 8 + React 19 兼容
- [ ] 1.2 创建新目录结构：`src/pages/`、`src/services/`、`src/contexts/`
- [ ] 1.3 创建 `src/data/types.ts`，定义 Product、Brand、Category、CartItem 接口

**验证**: `npm run build` 成功通过，新增目录存在，TypeScript 类型无报错

## 2. Mock 数据层 + API 服务

- [ ] 2.1 扩展 `src/data/projects.ts` → `src/data/products.ts`：将 18 条数据扩展至 30+ 条，每条增加 `price`、`originalPrice`、`brand`、`category`、`tags`、`shortDescription` 字段
- [ ] 2.2 创建 `src/services/api.ts`：封装 `getProducts(query)`、`getProductById(id)`、`getCategories()`、`getBrands()` 四个异步函数，每个返回 Promise 并模拟 200-400ms 延迟
- [ ] 2.3 实现 `getProducts` 的筛选（category/brand）、排序（price-asc/price-desc/newest）、分页逻辑
- [ ] 2.4 实现 `getProductById` 的商品不存在（返回 rejected Promise with 404 语义）

**验证**: 在浏览器 console 中临时调用 `api.getProducts()` 确认返回 Promise，数据格式符合 Product[] 类型

## 3. 路由系统 + 页面骨架

- [ ] 3.1 重构 `src/App.tsx`：从 section 堆叠改为 `<HashRouter>` 路由容器，保留 `<ThemeProvider>` 包裹
- [ ] 3.2 创建 `src/pages/LandingPage.tsx`：迁移现有 AppContent 内容（Hero + AboutSection），新增 FeaturedProducts 占位区
- [ ] 3.3 创建 `src/pages/ShopPage.tsx`：骨架页面，展示"商城建设中"占位
- [ ] 3.4 创建 `src/pages/ProductDetailPage.tsx`：骨架页面，从 `useParams()` 读取 id 并展示
- [ ] 3.5 创建 `src/pages/CartPage.tsx`：骨架页面，展示"购物车"标题
- [ ] 3.6 创建 404 NotFound 页面组件

**验证**: `npm run dev` 启动后四个路由 `/` `/shop` `/product/test` `/cart` 均渲染对应页面骨架，刷新不 404

## 4. 导航栏改造

- [ ] 4.1 改造 `Navbar.tsx`：导航项改为 `<Link>` 组件（首页→/、商品→/shop、购物车→/cart、关于我→/#contact 锚点）
- [ ] 4.2 新增购物车图标 + 数量徽标（从 CartContext 读取 totalItems）
- [ ] 4.3 当前激活路由高亮样式

**验证**: 点击各导航项正确跳转；购物车徽标初始为 0（隐藏）；锚点"关于我"在首页正常滚动

## 5. 商城页（ShopPage）

- [ ] 5.1 实现 `ShopPage.tsx`：使用 `useEffect` + `api.getProducts()` 获取数据，展示商品网格
- [ ] 5.2 改造 `ProjectCard.tsx` → `ProductCard.tsx`：增加价格展示（当前价 + 划线原价）、品牌标签、购物车"+"按钮
- [ ] 5.3 创建 `src/components/FilterBar.tsx`：分类标签（全部/鞋/包/表/香/配饰/数码）、品牌下拉
- [ ] 5.4 创建 `src/components/Pagination.tsx`：上一页/下一页/页码，与 query 联动
- [ ] 5.5 实现排序下拉（最新/价格升序/价格降序）
- [ ] 5.6 实现加载态（骨架屏）和空结果态（"没有找到符合条件的商品"）

**验证**: 商城页完整流程——默认 12 件/页，筛选品类后结果更新，翻页正常，排序生效

## 6. 商品详情页（ProductDetailPage）

- [ ] 6.1 实现 `ProductDetailPage.tsx`：从 `useParams()` 读取 id，调用 `api.getProductById(id)`，展示完整信息
- [ ] 6.2 实现大图展示区 + 品牌标签 + 完整描述 + 价格区（含原价划线和折扣计算）
- [ ] 6.3 实现数量选择器（- / 数字 / +）
- [ ] 6.4 实现"加入购物车"按钮，调用 CartContext.addItem()
- [ ] 6.5 实现商品不存在 404 错误展示
- [ ] 6.6 加入成功反馈（toast 提示或按钮状态变化）

**验证**: 从商城页点击商品 → 进入详情页 → 选择数量 → 加入购物车 → 导航栏徽标更新

## 7. 购物车（CartContext + CartPage）

- [ ] 7.1 创建 `src/contexts/CartContext.tsx`：useReducer 管理 items[]，提供 addItem / removeItem / updateQuantity / clear 操作
- [ ] 7.2 实现 localStorage 持久化（每次 state 变化写入，初始化时读取恢复）
- [ ] 7.3 实现 localStorage 数据损坏容错（JSON parse 失败时静默初始化为空购物车）
- [ ] 7.4 实现 `CartPage.tsx`：渲染 CartItem 列表 + 价格汇总
- [ ] 7.5 创建 `src/components/CartItem.tsx`：缩略图、名称、单价、数量调整、小计、移除按钮
- [ ] 7.6 实现空购物车态（"购物车是空的" + "去逛逛"按钮）
- [ ] 7.7 在 `App.tsx` 中挂载 `<CartProvider>` 包裹所有路由

**验证**: 添加商品 → /cart 可见 → 调整数量 → 总价更新 → 移除商品 → 刷新页面 → 数据仍在

## 8. 品牌首页（LandingPage）收尾

- [ ] 8.1 更新 Hero props：title 改为"潮流单品 · 品质之选"，ctaText 改为"进入商城"，ctaHref 改为 `/shop`
- [ ] 8.2 实现 FeaturedProducts 区域：加载最新 6 件商品，使用 ProductCard 展示
- [ ] 8.3 确保 AboutSection 保持不变（锚点 #contact），Navbar 中关于我跳转正确

**验证**: 首页 Hero 新文案正确，CTA 按钮跳转 /shop，精选区 6 件商品可点击进入详情

## 9. 集成验证 & 构建

- [ ] 9.1 端到端流程验证：首页 → 精选商品 → 详情页 → 加入购物车 → 商城浏览 → 筛选排序 → 加入购物车 → /cart → 修改数量 → 刷新恢复
- [ ] 9.2 暗色模式全页面检查（/、/shop、/product/:id、/cart 四个页面切换主题均正常）
- [ ] 9.3 移动端响应式检查（手机/平板/桌面三档）
- [ ] 9.4 `npm run build` 构建成功，dist/ 产物正常
- [ ] 9.5 `npm run preview` 预览模式验证 HashRouter 路由正常工作

**验证**: 全部页面功能正常、主题切换正常、响应式正常、构建成功
