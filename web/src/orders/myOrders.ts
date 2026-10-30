// Backend siparişi kullanıcıya bağlamıyor; bu tarayıcıdan verilen siparişlerin id'lerini hatırlıyoruz.
const key = (username: string) => `qs_my_orders:${username}`

export function getMyOrderIds(username: string): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key(username)) ?? '[]')
    return Array.isArray(parsed) ? (parsed as number[]) : []
  } catch {
    return []
  }
}

export function rememberOrders(username: string, ids: number[]) {
  const merged = Array.from(new Set([...getMyOrderIds(username), ...ids]))
  localStorage.setItem(key(username), JSON.stringify(merged))
}
