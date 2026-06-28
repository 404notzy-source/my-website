import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { recordView } from '../services/auth'
import { proxyImageUrl } from '../services/imageProxy'
import type { Product } from '../data/types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const { state } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    setAddedToCart(false)
    setQuantity(1)

    getProductById(id)
      .then(res => setProduct(res.product))
      .catch(() => setError('商品不存在'))
      .finally(() => setLoading(false))

    if (state.isAuthenticated) {
      recordView(id).catch(() => {})
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product.id, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 animate-pulse">
          <div className="aspect-video bg-slate-200 dark:bg-gray-700 rounded-xl" />
          <div className="mt-6 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{error || '商品不存在'}</p>
          <Link
            to="/shop"
            className="mt-6 inline-block px-8 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            返回商城
          </Link>
        </div>
      </div>
    )
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 顶部导航：返回按钮 + 面包屑 */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-500 transition-colors">首页</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-blue-500 transition-colors">商城</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </nav>
          <Link
            to="/shop"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            返回商城
          </Link>
        </div>

        {/* 商品图片画廊 - 新风格 */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 左侧：竖向缩略图列表 (桌面端) / 底部横排 (手机端) */}
          {(product.images && product.images.length > 1) && (
            <div className="hidden lg:flex flex-col gap-2 w-20 shrink-0 overflow-y-auto scrollbar-hide" style={{ maxHeight: '32rem' }}>
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    i === activeImage
                      ? 'border-blue-500 shadow-md'
                      : 'border-slate-200 dark:border-gray-700 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img src={proxyImageUrl(src)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 主图区域 */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center" className="bg-slate-50 dark:bg-gray-800/50" style={{ maxHeight: '32rem' }}>
              <img
                src={proxyImageUrl(product.images?.[activeImage] || product.imageUrl)}
                alt={product.name}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '32rem' }}
              />
              {/* 左右箭头 */}
              {(product.images && product.images.length > 1) && (
                <>
                  <button
                    onClick={() => setActiveImage(i => i > 0 ? i - 1 : product.images!.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-all"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setActiveImage(i => i < product.images!.length - 1 ? i + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900 transition-all"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
              {/* 图片计数 */}
              {(product.images && product.images.length > 1) && (
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                  {activeImage + 1} / {product.images.length}
                </span>
              )}
            </div>

            {/* 移动端：底部横排缩略图 */}
            {(product.images && product.images.length > 1) && (
              <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImage
                        ? 'border-blue-500 shadow-md'
                        : 'border-slate-200 dark:border-gray-700 opacity-70'
                    }`}
                  >
                    <img src={proxyImageUrl(src)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          {/* 品牌标签 */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-medium">
            {product.brand.name}
          </span>

          {/* 商品标签 */}
          {product.tags?.map(tag => (
            <span key={tag} className="ml-2 inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 text-sm font-medium">
              {tag}
            </span>
          ))}

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
            {product.name}
          </h1>

          <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* 价格区 */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-3xl font-bold text-red-500 dark:text-red-400">
              ¥{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  ¥{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* 数量选择器 + 加入购物车 */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors rounded-l-lg"
                aria-label="减少数量"
              >
                −
              </button>
              <span className="px-4 py-2 text-gray-900 dark:text-white font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors rounded-r-lg"
                aria-label="增加数量"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-500 ${
                addedToCart
                  ? 'scale-105 bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md'
              }`}
            >
              {addedToCart ? '✓ 已加入购物车' : '加入购物车'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
