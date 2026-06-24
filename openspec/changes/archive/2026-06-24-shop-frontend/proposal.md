## Why

当前项目是单页个人品牌站，所有内容平铺在 App.tsx 中，无路由、无页面隔离。要改造为"个人潮牌店"需要商品浏览、详情、购物车等独立页面——单页锚点架构无法支撑。引入客户端路由、拆分页面、建立 Mock 数据层，在不引入后端的前提下完成从"品牌站"到"潮牌店"的架构升级。

## What Changes

- **引入 React Router**：新增 `react-router-dom` 依赖，App.tsx 从"section 堆叠"重构为"路由容器"
- **新增 LandingPage**：将现有 Hero + ProjectSection(精选预览) + AboutSection 抽取为首页 `/`
- **新增 ShopPage**：独立商城页 `/shop`，含分类筛选、排序、响应式商品网格
- **新增 ProductDetailPage**：商品详情页 `/product/:id`，含图片、描述、价格、加入购物车
- **新增 CartPage**：购物车页 `/cart`，含商品列表、数量调整、移除、价格汇总
- **新增 CartContext**：全局购物车状态管理（React Context），跨页面共享
- **改造 Navbar**：同时支持 `<Link>` 路由跳转和锚点跳转，新增购物车图标+数量徽标
- **改造 ProjectCard → ProductCard**：增加价格字段、品牌标签、加入购物车按钮
- **新增 Mock 数据层**：扩展 `data/products.ts`（从 18 条扩至 30+ 条），新类型定义 `data/types.ts`
- **新增 Mock API 服务**：`services/api.ts` 封装数据访问（模拟异步请求），为后续替换真实 API 预留接口

## Capabilities

### New Capabilities

- `routing`: 客户端路由系统 —— `/` 品牌首页、`/shop` 商城、`/product/:id` 详情、`/cart` 购物车
- `landing-page`: 品牌 Landing Page —— Hero 区 + 精选商品预览 + 关于我，CTA 导向商城
- `shop-page`: 商城浏览页 —— 分类筛选、排序选项、响应式商品网格、分页
- `product-detail`: 商品详情页 —— 大图展示、完整描述、价格、品牌标签、加入购物车
- `cart`: 购物车系统 —— 全局 CartContext、商品增删改、数量调整、价格汇总、localStorage 持久化

### Modified Capabilities

- （无 —— openspec/specs/ 当前为空，无已有 spec 需要修改）

## Out of Scope / NOT Doing

- ❌ 后端 API 服务（FastAPI / SQLite / 任何服务端代码）
- ❌ AI 功能（推荐、搜索、对话、图像识别等）
- ❌ 用户认证 / 登录 / 注册
- ❌ 真实支付 / 结算流程
- ❌ SSR / SEO 优化（保持纯客户端 SPA）
- ❌ 部署方式变更（继续使用 GitHub Pages + gh-pages）

## Impact

### 受影响文件（需修改）

| 文件 | 改动程度 | 说明 |
|------|----------|------|
| `package.json` | 轻 | 新增 `react-router-dom` 依赖 |
| `src/App.tsx` | 重 | 从 section 堆叠重构为 `<Routes>` 路由容器 |
| `src/components/Navbar.tsx` | 中 | 新增 `Link` 支持 + 购物车图标徽标 |
| `src/components/ProjectCard.tsx` | 中 | 重命名为 ProductCard，新增加入购物车按钮 |
| `src/data/projects.ts` | 中 | 扩展为 `products.ts`，增加价格/品牌/分类字段 |

### 不受影响文件（零改动）

| 文件 | 说明 |
|------|------|
| `vite.config.ts` | 前端构建配置不动 |
| `src/main.tsx` | 入口文件不动 |
| `src/index.css` | 全局样式保留 |
| `src/components/ThemeProvider.tsx` | 直接全局复用 |
| `src/components/Hero.tsx` | 由 LandingPage 直接使用，内部不改 |
| `src/components/HeroParticles.tsx` | 零改动 |
| `src/components/AboutSection.tsx` | 零改动 |
| `tsconfig*.json` | 不动 |

### 回滚方案

路由重构是本次最高风险变更。回滚路径：
1. 保留原始 `App.tsx` 为 `App.backup.tsx` 再开始重构
2. 若路由引入后 GitHub Pages 部署异常（404 on refresh），通过 `vite.config.ts` 的 `base` 配置 + HashRouter 回退
3. 每一步在独立分支 `test-dev` 进行，确认无误后再合并
