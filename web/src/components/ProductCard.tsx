import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { categoryInfo, formatPrice } from '../lib/format'
import type { Product } from '../types'
import ProductVisual from './ProductVisual'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const out = product.stock < 1

  function handleAdd() {
    add(product, 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <ProductVisual name={product.name} sku={product.sku} category={product.category} />
        <div className="product-body">
          <span className="eyebrow">{categoryInfo(product.category).label}</span>
          <h3>{product.name}</h3>
          <p className="muted clamp">{product.description}</p>
        </div>
      </Link>
      <div className="product-foot">
        <div>
          <strong className="price">{formatPrice(product.price)}</strong>
          {out ? (
            <span className="stock stock-out">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="stock stock-low">Only {product.stock} left</span>
          ) : null}
        </div>
        <button className="btn btn-primary btn-sm" disabled={out} onClick={handleAdd}>
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
