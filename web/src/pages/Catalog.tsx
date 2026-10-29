import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { categoryInfo } from '../lib/format'

type Sort = 'name' | 'price-asc' | 'price-desc'

export default function Catalog() {
  const { products, loading, error } = useProducts()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('name')

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
    )
    return [...list].sort((a, b) =>
      sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name),
    )
  }, [products, category, query, sort])

  return (
    <>
      <h2>Shop</h2>
      <div className="toolbar">
        <input
          className="input search"
          placeholder="Search by name or SKU…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="name">Name</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="chips">
        <button className={`chip${category === '' ? ' active' : ''}`} onClick={() => setParams({})}>
          All
        </button>
        {categories.map((code) => (
          <button
            key={code}
            className={`chip${category === code ? ' active' : ''}`}
            onClick={() => setParams({ category: code })}
          >
            {categoryInfo(code).icon} {categoryInfo(code).label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No products found.</p>
      ) : (
        <>
          <p className="muted">{visible.length} {visible.length === 1 ? 'product' : 'products'}</p>
          <div className="grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </>
  )
}
