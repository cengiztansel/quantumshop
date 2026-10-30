import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import ProductVisual from '../components/ProductVisual'
import { useProducts } from '../hooks/useProducts'
import { categoryInfo, formatPrice } from '../lib/format'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { products, loading, error } = useProducts()
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => String(p.id) === id)

  if (loading) return <p className="muted">Loading…</p>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!product) {
    return (
      <>
        <Link to="/shop" className="back">← Back to shop</Link>
        <p>Product not found.</p>
      </>
    )
  }

  const out = product.stock < 1

  return (
    <>
      <Link to="/shop" className="back">← Back to shop</Link>
      <div className="detail">
        <ProductVisual name={product.name} sku={product.sku} category={product.category} large />
        <div>
          <span className="eyebrow">{categoryInfo(product.category).label}</span>
          <h1>{product.name}</h1>
          <p className="muted">SKU: {product.sku}</p>
          <p>{product.description}</p>
          <strong className="price">{formatPrice(product.price)}</strong>
          <p className={out ? 'stock stock-out' : 'muted'}>
            {out ? 'Out of stock' : `${product.stock} in stock`}
          </p>

          {!out && (
            <div className="detail-actions">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  add(product, qty)
                  setAdded(true)
                }}
              >
                Add to cart
              </button>
            </div>
          )}
          {added && (
            <div className="alert alert-success">
              Added to your cart. <Link to="/cart"><strong>Go to cart →</strong></Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
