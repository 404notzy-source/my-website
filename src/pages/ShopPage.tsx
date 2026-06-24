import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import { getProducts, getCategories, getBrands } from '../services/api'
import type { Product, Category } from '../data/types'

type SortOption = 'newest' | 'price-asc' | 'price-desc'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])

  const activeCategory = (searchParams.get('category') as Category) || undefined
  const activeBrand = searchParams.get('brand') || undefined
  const activeSort = (searchParams.get('sort') as SortOption) || 'newest'
  const activePage = parseInt(searchParams.get('page') || '1', 10)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getProducts({
        category: activeCategory,
        brand: activeBrand,
        sort: activeSort,
        page: activePage,
        pageSize: 12,
      })
      setProducts(res.products)
      setTotal(res.total)
    } catch {
      setError('加载商品失败，请稍后重试')
      setProducts([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, activeBrand, activeSort, activePage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    getCategories().then(res => setCategories(res.categories)).catch(() => {})
    getBrands().then(res => setBrands(res.brands)).catch(() => {})
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / 12))

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      if (key !== 'page') {
        next.delete('page')
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-700">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center transition-colors duration-500">
          商城
        </h1>
        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
          潮流单品，品质之选
        </p>

        <FilterBar
          categories={categories}
          brands={brands}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          activeSort={activeSort}
          onCategoryChange={cat => updateParam('category', cat)}
          onBrandChange={brand => updateParam('brand', brand)}
          onSortChange={sort => updateParam('sort', sort === 'newest' ? null : sort)}
        />

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-16 text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              没有找到符合条件的商品
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-6 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              清除全部筛选
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={page => updateParam('page', page > 1 ? String(page) : null)}
            />
          </>
        )}
      </div>
    </div>
  )
}
