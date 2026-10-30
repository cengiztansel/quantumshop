import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { changeOrderStatus, deleteOrder, fetchOrders } from '../api/shop'
import { useAuth } from '../auth/AuthContext'
import { formatDate } from '../lib/format'
import { getMyOrderIds } from '../orders/myOrders'
import type { Order, OrderStatus } from '../types'

// Backend'deki durum makinesinin aynısı; gerçek kural sunucuda, bu sadece hangi butonların görüneceği
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}
const LABELS: Record<OrderStatus, string> = {
  CREATED: 'Created',
  PAID: 'Mark as paid',
  SHIPPED: 'Ship',
  DELIVERED: 'Deliver',
  CANCELLED: 'Cancel order',
}
const FLOW: OrderStatus[] = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED']

function Stepper({ status }: { status: OrderStatus }) {
  if (status === 'CANCELLED') return null
  const index = FLOW.indexOf(status)
  return (
    <div className="stepper">
      {FLOW.map((s, i) => (
        <div key={s} className={`step${i <= index ? ' done' : ''}`}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </div>
      ))}
    </div>
  )
}

export default function Orders() {
  const { session } = useAuth()
  const location = useLocation()
  const placed = (location.state as { placed?: number } | null)?.placed

  const [orders, setOrders] = useState<Order[]>([])
  const [view, setView] = useState<'mine' | 'all'>('mine')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const myIds = useMemo(() => new Set<number>(session ? getMyOrderIds(session.username) : []), [session])

  const load = useCallback(async () => {
    try {
      setOrders((await fetchOrders()) ?? [])
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function act(fn: () => Promise<unknown>) {
    try {
      await fn()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed') // örn. 409: geçersiz durum geçişi
    }
  }

  const visible = view === 'all' ? orders : orders.filter((o) => myIds.has(o.id))

  return (
    <>
      <div className="toolbar">
        <h2 style={{ margin: 0, flex: 1 }}>Orders</h2>
        <div className="tabs">
          <button className={view === 'mine' ? 'active' : ''} onClick={() => setView('mine')}>My orders</button>
          <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>All orders (demo)</button>
        </div>
      </div>

      {placed ? (
        <div className="alert alert-success">
          {placed} {placed === 1 ? 'order' : 'orders'} placed successfully.
        </div>
      ) : null}
      <div className="alert alert-info">
        Orders are not linked to user accounts in the backend yet. “My orders” shows the orders placed from this browser.
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No orders to show.</p>
      ) : (
        <div className="order-list">
          {visible.map((o) => (
            <article className="order-card" key={o.id}>
              <div className="order-top">
                <div>
                  <div className="order-title">#{o.id} • {o.productName}</div>
                  <div className="muted">Qty {o.quantity} • {formatDate(o.createdAt)}</div>
                </div>
                <span className={`badge badge-${o.status}`}>{o.status}</span>
              </div>
              <Stepper status={o.status} />
              <div className="order-actions">
                {TRANSITIONS[o.status].map((next) => (
                  <button
                    key={next}
                    className={`btn btn-sm ${next === 'CANCELLED' ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => act(() => changeOrderStatus(o.id, next))}
                  >
                    {LABELS[next]}
                  </button>
                ))}
                {(o.status === 'CREATED' || o.status === 'CANCELLED') && (
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      if (window.confirm(`Delete order #${o.id}?`)) act(() => deleteOrder(o.id))
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
