import { categoryInfo, formatPrice } from '../lib/format'
import type { Product } from '../types'
import ProductVisual from './ProductVisual'

export default function ProductCard({ product }: { product: Product }) {
  const out = product.stock < 1
  return (
    <article className="product-card">
      <ProductVisual name={product.name} sku={product.sku} category={product.category} />
      <div className="product-body">
        <span className="eyebrow">{categoryInfo(product.category).label}</span>
        <h3>{product.name}</h3>
        <p className="muted clamp">{product.description}</p>
      </div>
      <div className="product-foot">
        <div>
          <strong className="price">{formatPrice(product.price)}</strong>
          {out ? (
            <span className="stock stock-out">Out of stock</span>
          ) : product.stock <= 5 ? (
            <span className="stock stock-low">Only {product.stock} left</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
