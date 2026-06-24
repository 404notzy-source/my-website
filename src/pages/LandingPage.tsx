import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'
import type { Product } from '../data/types'

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ sort: 'newest', pageSize: 6 })
      .then(res => setFeaturedProducts(res.products))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-700">
      {/* 主题切换按钮 */}
      <ThemeToggleButton />

      <Hero
        name="大超潮牌店"
        title="潮流单品 · 品质之选"
        tagline="不随波逐流，只做时间洪流里的风格雕刻者。"
        ctaText="进入商城"
        ctaHref="/#/shop"
      />

      {/* 精选商品预览 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-700">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-500">
            精选好物
          </h2>
          <p className="mt-3 text-center text-gray-500 dark:text-gray-400 transition-colors duration-500">
            潮流单品，品质之选
          </p>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="mt-16 text-center text-gray-400 dark:text-gray-500">
              暂无精选商品
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-8 py-3 text-base font-medium text-blue-600 dark:text-blue-400 transition-all duration-500 hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              查看全部商品
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H17.25M17.25 6L17.25 9.75M17.25 6L7 16.5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function ThemeToggleButton() {
  // Theme toggle is handled via useTheme hook; alternative local impl for standalone pages
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-500"
      aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
