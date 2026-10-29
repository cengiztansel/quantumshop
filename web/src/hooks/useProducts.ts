import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/shop'
import type { Product } from '../types'

// Ürünler bir kez çekilir ve sayfalar arasında paylaşılır
let cache: Product[] | null = null
let inflight: Promise<Product[]> | null = null

function load(): Promise<Product[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchProducts()
      .then((list) => {
        cache = list
        return list
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    load()
      .then((list) => {
        if (cancelled) return
        setProducts(list)
        setError('')
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}
