import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/types'
import { proxyImageUrl } from '../services/imageProxy'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%22300%22 y=%22210%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2224%22%3E暂无图片%3C/text%3E%3C/svg%3E'

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article className="group rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-gray-950/50">
      {/* 商品图片 */}
      <Link to={`/product/${product.id}`} className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-gray-800">
        <img
          src={imgError ? PLACEHOLDER : proxyImageUrl(product.imageUrl)}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/80 text-white backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* 内容区 */}
      <div className="p-5">
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 mb-2">
          {product.brand.name}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
          {product.shortDescription}
        </p>
      </div>
    </article>
  )
}
