import { categoryCode } from '../lib/format'
import type { AuthResponse, Order, OrderStatus, Page, Product, ProductDto } from '../types'
import { http } from './client'

function toProduct(dto: ProductDto): Product {
  const sku = dto.sku ?? ''
  return {
    id: dto.id,
    sku,
    name: dto.name,
    description: dto.description ?? '',
    price: Number(dto.price),
    stock: dto.stockQuantity ?? 0,
    category: categoryCode(sku),
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await http.get<Page<ProductDto> | ProductDto[]>('/products')
  const list = Array.isArray(data) ? data : data.content
  return list.filter((p) => p.active !== false).map(toProduct)
}

export const login = (username: string, password: string) =>
  http.post<AuthResponse>('/auth/login', { username, password })

export const register = (username: string, email: string, password: string) =>
  http.post<AuthResponse>('/auth/register', { username, email, password })

export const fetchOrders = () => http.get<Order[]>('/orders')

export const createOrder = (productName: string, quantity: number) =>
  http.post<Order>('/orders', { productName, quantity })

export const changeOrderStatus = (id: number, status: OrderStatus) =>
  http.patch<Order>(`/orders/${id}/status`, { status })

export const deleteOrder = (id: number) => http.delete(`/orders/${id}`)
