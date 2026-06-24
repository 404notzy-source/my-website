export type Category = 'shoes' | 'bags' | 'watches' | 'fragrance' | 'accessories' | 'digital'

export interface Brand {
  id: string
  name: string
  logoUrl?: string
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  brand: Brand
  category: Category
  imageUrl: string
  images?: string[]
  tags?: string[]
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
  addedAt: string
}

export interface CartState {
  items: CartItem[]
}

export interface ProductQuery {
  category?: Category
  brand?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
  page?: number
  pageSize?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export interface ProductDetailResponse {
  product: Product
}
