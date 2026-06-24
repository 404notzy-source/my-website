import type { Category } from '../data/types'

const CATEGORY_LABELS: Record<Category, string> = {
  shoes: '鞋',
  bags: '包',
  watches: '表',
  fragrance: '香',
  accessories: '配饰',
  digital: '数码',
}

interface FilterBarProps {
  categories: Category[]
  brands: { id: string; name: string }[]
  activeCategory?: Category
  activeBrand?: string
  activeSort: string
  onCategoryChange: (category: Category | null) => void
  onBrandChange: (brand: string | null) => void
  onSortChange: (sort: string) => void
}

export default function FilterBar({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeSort,
  onCategoryChange,
  onBrandChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mt-8 space-y-4">
      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            !activeCategory
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
          }`}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* 品牌 + 排序 */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={activeBrand || ''}
          onChange={e => onBrandChange(e.target.value || null)}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-colors"
        >
          <option value="">全部品牌</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        <select
          value={activeSort}
          onChange={e => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-colors"
        >
          <option value="newest">最新</option>
          <option value="price-asc">价格: 从低到高</option>
          <option value="price-desc">价格: 从高到低</option>
        </select>
      </div>
    </div>
  )
}
