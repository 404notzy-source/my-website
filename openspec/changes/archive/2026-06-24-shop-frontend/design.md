## Context

当前项目是纯前端 SPA：Vite + React 19 + Tailwind CSS 4，7 个组件全部为函数式组件，App.tsx 平铺所有 section，无路由，无 API 层。数据 18 条硬编码于 `data/projects.ts`。部署于 GitHub Pages（base: `/my-website/`）。

本次改造目标：在**不引入任何后端服务**的前提下，将单页品牌站升级为多页面潮牌店，使用 Mock 数据模拟完整电商浏览流程。

## Goals / Non-Goals

**Goals:**
- 引入客户端路由，支持 `/`、`/shop`、`/product/:id`、`/cart` 四个独立页面
- 建立 Mock 数据层（30+ 商品），封装为异步 API 服务，预留真实 API 替换接口
- 全局购物车状态管理（Context + localStorage 持久化）
- 最大化复用现有组件（ThemeProvider、Hero、HeroParticles、AboutSection 零改动）
- 所有新组件遵循现有代码标准（函数式组件 + Tailwind + 暗色模式 + lazy loading）

**Non-Goals:**
- 后端 API 服务
- 用户认证系统
- AI 相关功能
- 真实支付/结算
- SSR / SEO 优化
- 部署方式变更

## Decisions

### 1. 路由方案：React Router v7（HashRouter）

**选择 HashRouter 而非 BrowserRouter**

- GitHub Pages 是静态托管，不支持服务端路由 fallback。BrowserRouter 会在用户刷新 `/shop` 时返回 404
- HashRouter 将路由编码在 `#` 后（如 `/#/shop`），刷新时服务端始终返回 `index.html`，零配置兼容 GitHub Pages
- 成本：URL 中有 `#` 符号，对 SEO 有轻微影响，但本项目 out-of-scope 不含 SEO

**反对方案：**
- BrowserRouter + 404.html 重定向：hacky，URL 会丢失原始路径
- TanStack Router：更重（~30KB vs React Router ~15KB），本项目路由简单不需要类型安全路由
- 手工条件渲染：回到锚点模式，不解决页面隔离问题

### 2. 数据层架构：Mock API Service 模式

```
组件层 (Pages/Components)
    │  useProducts(), useProduct(id), useCart()
    │
服务层 (services/api.ts)
    │  getProducts(), getProductById(), getCategories()
    │  → 当前返回 Mock 数据 (Promise-wrapped)
    │  → 未来替换为 fetch() 调用，接口签名不变
    │
数据层 (data/products.ts)
    │  Product[] 静态数据 (30+ 条)
    │  types.ts: Product, Category, CartItem 接口定义
```

**为什么用 Service 层而不是直接在组件里 import 数据：**
- 当前是同步 import，未来替换 API 需要改每一个组件
- Service 层封装为 Promise 返回，组件用 `useEffect` / `useState` 消费，未来只需改 service 内部实现，组件零改动
- 与 proposal 中 "为后续替换真实 API 预留接口" 一致

### 3. 购物车状态：React Context + useReducer + localStorage

**为什么用 Context + useReducer 而非 Zustand / Redux：**
- 购物车状态结构简单（items[], add/remove/updateQuantity/clear），不需要中间件/immer/devtools
- 项目已有一个 Context（ThemeProvider），保持模式一致
- Zustand 虽然轻量但引入新依赖，不符合 "最小变更" 原则

**持久化策略：**
- 每次 state 变化同步写入 `localStorage('shop-cart')`
- 初始化时从 localStorage 读取恢复
- 不实现服务端同步（out-of-scope）

### 4. 组件拆分策略：页面组件 vs 共享组件

```
src/
├── pages/              ← 新建：页面级组件（每个路由对应一个）
│   ├── LandingPage.tsx
│   ├── ShopPage.tsx
│   ├── ProductDetailPage.tsx
│   └── CartPage.tsx
├── components/         ← 共享 + 原有组件
│   ├── ThemeProvider.tsx   (保留)
│   ├── Navbar.tsx          (改造)
│   ├── Hero.tsx            (保留)
│   ├── HeroParticles.tsx   (保留)
│   ├── ProductCard.tsx     (改造：原 ProjectCard)
│   ├── AboutSection.tsx    (保留)
│   ├── FilterBar.tsx       (新建)
│   ├── CartItem.tsx        (新建)
│   └── Pagination.tsx      (新建)
├── contexts/           ← 新建：全局状态
│   └── CartContext.tsx
├── services/           ← 新建：数据访问层
│   └── api.ts
├── data/               ← 扩展
│   ├── types.ts         (新建：类型定义)
│   └── products.ts      (扩展：18→30+ 条，增加字段)
├── App.tsx              (重构：路由容器)
├── main.tsx             (不动)
└── index.css            (不动)
```

## 组件层级图

```
App.tsx
└── <ThemeProvider>
    └── <HashRouter>
        └── <CartProvider>            ← 新建：购物车 Context
            ├── <Navbar />            ← 改造：Link + 购物车徽标
            │
            └── <Routes>
                │
                ├── path="/"
                │   └── <LandingPage>
                │       ├── <Hero />              (保留，props 微调)
                │       ├── <FeaturedProducts />   (新建：精选6件预览)
                │       └── <AboutSection />       (保留)
                │
                ├── path="/shop"
                │   └── <ShopPage>
                │       ├── <FilterBar />          (新建：分类 + 排序)
                │       ├── <ProductGrid>          (新建：网格容器)
                │       │   └── <ProductCard /> × N (改造)
                │       └── <Pagination />          (新建：分页)
                │
                ├── path="/product/:id"
                │   └── <ProductDetailPage>
                │       └── <ProductCard />         (可选：同类推荐)
                │
                └── path="/cart"
                    └── <CartPage>
                        └── <CartItem /> × N        (新建：购物车行)
```

## 数据模型

```
┌─────────────────────────────────────────────┐
│                  Product                     │
├─────────────────────────────────────────────┤
│  id: string              (PK, kebab-case)    │
│  name: string                               │
│  description: string    (完整描述)            │
│  shortDescription: string (卡片摘要)          │
│  price: number          (人民币, 元)          │
│  originalPrice?: number (划线原价)            │
│  brand: Brand                               │
│  category: Category     (鞋/包/表/香/数码)    │
│  imageUrl: string                           │
│  images?: string[]      (详情页轮播)          │
│  tags?: string[]        (新品/热卖/限量)      │
│  createdAt: string      (ISO date)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                  Brand                       │
├─────────────────────────────────────────────┤
│  id: string                                 │
│  name: string           (Nike, Chanel...)    │
│  logoUrl?: string                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                  CartItem                    │
├─────────────────────────────────────────────┤
│  productId: string     (关联 Product.id)     │
│  quantity: number                           │
│  addedAt: string       (ISO date)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                  CartState                   │
├─────────────────────────────────────────────┤
│  items: CartItem[]                          │
│  totalItems: number     (派生：总件数)        │
│  totalPrice: number     (派生：总金额)        │
└─────────────────────────────────────────────┘
```

**分类枚举：**
```
Category: 'shoes' | 'bags' | 'watches' | 'fragrance' | 'accessories' | 'digital'
Brand: 见 products.ts 中已有18个品牌，扩展至30+覆盖更多品牌
```

## API 服务接口规范（Mock）

所有接口返回 `Promise`，模拟 200-400ms 网络延迟。错误场景返回 rejected Promise。

| Method | Path | Request | Response | 错误码 |
|--------|------|---------|----------|--------|
| `GET` | `/api/products` | `query?: { category?, brand?, sort?, page?, pageSize? }` | `{ products: Product[], total: number, page: number, pageSize: number }` | 400 (无效参数) |
| `GET` | `/api/products/:id` | — | `{ product: Product }` | 404 (商品不存在) |
| `GET` | `/api/categories` | — | `{ categories: Category[] }` | — |
| `GET` | `/api/brands` | — | `{ brands: Brand[] }` | — |

## Risks / Trade-offs

| Risk | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| HashRouter 导致 URL 不美观 | 100% | 低 | 本项目为个人品牌站，非面向 SEO 的内容站；未来如需可迁 BrowserRouter + 服务端配置 |
| 30+ 商品 Mock 数据维护负担 | 中 | 低 | 数据仍在单文件 `products.ts`，过渡方案；后续真实 API 直接替换 |
| CartContext 性能 | 低 | 低 | 购物车数据量小（<100 项）；必要时可拆分为 CartStateContext + CartDispatchContext |
| react-router-dom 与 Vite 8 兼容性 | 低 | 中 | React Router v7 官方支持 Vite；安装后立即验证 build |
| 引入路由后 GitHub Pages 部署失败 | 中 | 高 | HashRouter 天然兼容；Phase 1 完成后立即部署验证 |

## Open Questions

1. **ProductCard 重命名还是新建？** — 倾向重命名 ProjectCard → ProductCard（旧组件本身没有特殊逻辑），但需全局搜索引用确保无遗漏
2. **商品详情页图片轮播？** — 可选：简单方案 `<img>` + 缩略图列表；复杂方案引入 Swiper。建议 Phase 实施时根据复杂度决定
3. **移动端导航菜单？** — 当前 Navbar 无汉堡菜单。5 个导航项在手机上可能溢出。建议作为 shop-frontend 的一部分实现
