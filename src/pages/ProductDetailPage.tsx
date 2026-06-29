import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { recordView } from '../services/auth'
import { proxyImageUrl } from '../services/imageProxy'
import type { Product } from '../data/types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    getProductById(id)
      .then(res => setProduct(res.product))
      .catch(() => setError('商品不存在'))
      .finally(() => setLoading(false))

    if (state.isAuthenticated) {
      recordView(id).catch(() => {})
    }
  }, [id])

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
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-gray-800/50" style={{ maxHeight: '32rem' }}>
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
                    className="group absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setActiveImage(i => i < product.images!.length - 1 ? i + 1 : 0)}
                    className="group absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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

          {/* 询价按钮 */}
          <div className="mt-8">
            <a
              href="https://wa.me/8618030032410"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 active:scale-95 transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              询价
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
