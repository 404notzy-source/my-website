import { products } from '../data/products'
import type { Product, ProductQuery, ProductListResponse, ProductDetailResponse, Category } from '../data/types'

const DELAY_MS = 250

function delay(ms: number = DELAY_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 150))
}

function filterProducts(query: ProductQuery): Product[] {
  let result = [...products]

  if (query.category) {
    result = result.filter(p => p.category === query.category)
  }

  if (query.brand) {
    result = result.filter(p => p.brand.id === query.brand)
  }

  switch (query.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return result
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  await delay()

  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 12

  const filtered = filterProducts(query)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  if (start >= total && total > 0) {
    throw new Error('Invalid page number')
  }

  return {
    products: paged,
    total,
    page,
    pageSize,
  }
}

export async function getProductById(id: string): Promise<ProductDetailResponse> {
  await delay()

  const product = products.find(p => p.id === id)

  if (!product) {
    throw new Error('Product not found')
  }

  return { product }
}

export async function getCategories(): Promise<{ categories: Category[] }> {
  await delay()

  const categorySet = new Set<Category>()
  products.forEach(p => categorySet.add(p.category))

  return {
    categories: Array.from(categorySet),
  }
}

export async function getBrands(): Promise<{ brands: { id: string; name: string }[] }> {
  await delay()

  const brandMap = new Map<string, { id: string; name: string }>()
  products.forEach(p => {
    if (!brandMap.has(p.brand.id)) {
      brandMap.set(p.brand.id, { id: p.brand.id, name: p.brand.name })
    }
  })

  return {
    brands: Array.from(brandMap.values()),
  }
}
