import type { CartItem, Product } from '../types'

export function addItem(items: CartItem[], product: Product, quantity = 1): CartItem[] {
  const existing = items.find((i) => i.productId === product.id)
  if (existing) {
    return items.map((i) =>
      i.productId === product.id
        ? { ...i, stock: product.stock, quantity: Math.min(i.quantity + quantity, product.stock) }
        : i,
    )
  }
  const qty = Math.min(quantity, product.stock)
  if (qty < 1) return items
  return [
    ...items,
    { productId: product.id, sku: product.sku, name: product.name, price: product.price, quantity: qty, stock: product.stock },
  ]
}

export function removeItem(items: CartItem[], productId: number): CartItem[] {
  return items.filter((i) => i.productId !== productId)
}

export function setQuantity(items: CartItem[], productId: number, quantity: number): CartItem[] {
  if (!Number.isFinite(quantity)) return items
  if (quantity < 1) return removeItem(items, productId)
  return items.map((i) =>
    i.productId === productId ? { ...i, quantity: Math.min(Math.floor(quantity), i.stock) } : i,
  )
}

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0)

// Kuruş hassasiyeti: 100.1 * 3 = 300.29999999999995 olmasın
export const cartTotal = (items: CartItem[]) =>
  Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100

