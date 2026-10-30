import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import { addItem, cartCount, cartTotal, removeItem, setQuantity } from './cart'

const CART_KEY = 'qs_cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  add(product: Product, quantity?: number): void
  setQty(productId: number, quantity: number): void
  remove(productId: number): void
  replace(items: CartItem[]): void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: cartCount(items),
      total: cartTotal(items),
      add: (product, quantity = 1) => setItems((cur) => addItem(cur, product, quantity)),
      setQty: (id, quantity) => setItems((cur) => setQuantity(cur, id, quantity)),
      remove: (id) => setItems((cur) => removeItem(cur, id)),
      replace: (next) => setItems(next),
    }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
