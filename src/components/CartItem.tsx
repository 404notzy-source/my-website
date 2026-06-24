import type { CartItem as CartItemType, Product } from '../data/types'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%22300%22 y=%22210%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2224%22%3E暂无图片%3C/text%3E%3C/svg%3E'

interface CartItemProps {
  item: CartItemType
  product?: Product
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function CartItemComponent({ item, product, onUpdateQuantity, onRemove }: CartItemProps) {
  if (!product) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-gray-700">
        <p className="text-sm text-gray-400">商品已下架</p>
        <button
          onClick={() => onRemove(item.productId)}
          className="ml-auto text-sm text-red-400 hover:text-red-500"
        >
          移除
        </button>
      </div>
    )
  }

  const subtotal = product.price * item.quantity

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        className="w-20 h-20 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ¥{product.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center border border-slate-200 dark:border-gray-600 rounded-lg shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors rounded-l-lg"
          aria-label="减少数量"
        >
          −
        </button>
        <span className="px-3 py-1 text-sm text-gray-900 dark:text-white font-medium min-w-[2rem] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors rounded-r-lg"
          aria-label="增加数量"
        >
          +
        </button>
      </div>

      <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right shrink-0">
        ¥{subtotal.toLocaleString()}
      </span>

      <button
        onClick={() => onRemove(item.productId)}
        className="text-sm text-gray-400 hover:text-red-500 transition-colors shrink-0"
        aria-label="移除商品"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
