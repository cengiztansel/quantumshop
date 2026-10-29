export interface ProductDto {
  id: number
  sku: string
  name: string
  description: string | null
  price: number
  stockQuantity: number
  active: boolean
}

export interface Page<T> {
  content: T[]
}

export interface Product {
  id: number
  sku: string
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: number
  productName: string
  quantity: number
  status: OrderStatus
  createdAt: string | null
}

export interface AuthResponse {
  token: string
  username: string
  role: string
}

export interface Session {
  username: string
  role: string
}

export interface CartItem {
  productId: number
  sku: string
  name: string
  price: number
  quantity: number
  stock: number
}
