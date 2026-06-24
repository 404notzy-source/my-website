import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import CartItemComponent from '../components/CartItem'
import { products } from '../data/products'

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  const cartProductItems = state.items.map(item => {
    const product = products.find(p => p.id === item.productId)
    return { item, product }
  })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartProductItems.reduce((sum, { item, product }) => {
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">购物车</h1>
          <div className="mt-16">
            <p className="text-xl text-gray-400 dark:text-gray-500">购物车是空的</p>
            <Link
              to="/shop"
              className="mt-6 inline-block px-8 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              去逛逛
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">购物车</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            清空购物车
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {cartProductItems.map(({ item, product }) => (
            <CartItemComponent
              key={item.productId}
              item={item}
              product={product}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* 价格汇总 */}
        <div className="mt-8 border-t border-slate-200 dark:border-gray-700 pt-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-500 dark:text-gray-400">
              共 {totalItems} 件商品
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              合计 ¥{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
