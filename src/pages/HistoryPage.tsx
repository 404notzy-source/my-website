import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../services/auth'
import { products } from '../data/products'
import type { BrowseHistoryItem } from '../services/auth'
import type { Product } from '../data/types'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%22300%22 y=%22210%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2224%22%3E暂无图片%3C/text%3E%3C/svg%3E'

export default function HistoryPage() {
  const [items, setItems] = useState<BrowseHistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory(1, 50)
      .then(res => { setItems(res.items); setTotal(res.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getProduct = (productId: string): Product | undefined =>
    products.find(p => p.id === productId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/profile" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">浏览足迹</h1>
          <span className="text-sm text-gray-400 dark:text-gray-500">共 {total} 件</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-lg">暂无浏览记录</p>
            <Link to="/shop" className="mt-4 inline-block px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              去逛逛
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              const product = getProduct(item.product_id)
              return (
                <Link
                  key={`${item.product_id}-${item.viewed_at}`}
                  to={`/product/${item.product_id}`}
                  className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-all"
                >
                  <img
                    src={product?.imageUrl || PLACEHOLDER}
                    alt={product?.name || item.product_id}
                    className="w-16 h-12 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-gray-800"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {product?.name || item.product_id}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {product?.brand.name} · ¥{product?.price.toLocaleString() || '—'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {new Date(item.viewed_at).toLocaleDateString('zh-CN')}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
