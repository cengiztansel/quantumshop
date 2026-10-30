import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../api/shop'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'
import ProductVisual from '../components/ProductVisual'
import { categoryCode, formatPrice } from '../lib/format'
import { rememberOrders } from '../orders/myOrders'
import type { CartItem } from '../types'

export default function Cart() {
  const { items, count, total, setQty, remove, replace } = useCart()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function checkout() {
    if (!session) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setBusy(true)
    setError('')

    const created: number[] = []
    const failed: CartItem[] = []
    const messages: string[] = []

    // order-service sipariş başına tek ürün saklıyor: her sepet satırı ayrı sipariş olur
    for (const item of items) {
      try {
        const order = await createOrder(item.name, item.quantity)
        created.push(order.id)
      } catch (e) {
        failed.push(item)
        messages.push(`${item.name}: ${e instanceof Error ? e.message : 'failed'}`)
      }
    }

    if (created.length > 0) rememberOrders(session.username, created)
    replace(failed) // başarısız satırlar sepette kalır
    setBusy(false)

    if (failed.length === 0) navigate('/orders', { state: { placed: created.length } })
    else setError(`Some items could not be ordered. ${messages.join(' • ')}`)
  }

  if (items.length === 0) {
    return (
      <div className="panel empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Find something you like in the shop.</p>
        <Link to="/shop" className="btn btn-primary">Browse products</Link>
      </div>
    )
  }

  return (
    <>
      <h2>Your cart</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="cart-layout">
        <div className="panel">
          {items.map((item) => (
            <div className="cart-line" key={item.productId}>
              <ProductVisual name={item.name} sku={item.sku} category={categoryCode(item.sku)} />
              <div>
                <Link to={`/products/${item.productId}`}><strong>{item.name}</strong></Link>
                <div className="muted">{formatPrice(item.price)} each</div>
              </div>
              <div className="line-controls">
                <div className="qty">
                  <button onClick={() => setQty(item.productId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => setQty(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
                <button className="link-btn" onClick={() => remove(item.productId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="panel">
          <h3>Summary</h3>
          <div className="summary-row"><span>Items</span><span>{count}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn btn-primary btn-block" onClick={checkout} disabled={busy}>
            {busy ? 'Placing orders…' : session ? 'Place order' : 'Sign in to order'}
          </button>
          <p className="muted small">Each cart line is placed as a separate order.</p>
        </aside>
      </div>
    </>
  )
}
