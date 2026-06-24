import { createContext, useContext, useReducer, useEffect, useState, type ReactNode, type Dispatch } from 'react'
import type { CartItem } from '../data/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; productId: string; quantity: number }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'RESTORE'; items: CartItem[] }

const STORAGE_KEY = 'shop-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item: unknown) =>
            typeof item === 'object' &&
            item !== null &&
            'productId' in item &&
            'quantity' in item &&
            typeof (item as CartItem).productId === 'string' &&
            typeof (item as CartItem).quantity === 'number'
        )
      }
    }
  } catch {
    // localStorage 数据损坏，静默降级
  }
  return []
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage quota exceeded, silently fail
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.productId === action.productId)
      if (existing) {
        return {
          items: state.items.map(item =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        }
      }
      return {
        items: [...state.items, {
          productId: action.productId,
          quantity: action.quantity,
          addedAt: new Date().toISOString(),
        }],
      }
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { items: state.items.filter(item => item.productId !== action.productId) }
      }
      return {
        items: state.items.map(item =>
          item.productId === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(item => item.productId !== action.productId) }
    case 'CLEAR':
      return { items: [] }
    case 'RESTORE':
      return { items: action.items }
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  dispatch: Dispatch<CartAction>
  addItem: (productId: string, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalItems: number
  lastAddedTime: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [lastAddedTime, setLastAddedTime] = useState(0)

  useEffect(() => {
    const saved = loadCart()
    if (saved.length > 0) {
      dispatch({ type: 'RESTORE', items: saved })
    }
  }, [])

  useEffect(() => {
    saveCart(state.items)
  }, [state.items])

  const addItem = (productId: string, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', productId, quantity })
    setLastAddedTime(Date.now())
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR' })
  }

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, updateQuantity, removeItem, clearCart, totalItems, lastAddedTime }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
