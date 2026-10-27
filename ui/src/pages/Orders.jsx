import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

// Backend'deki durum makinesinin aynısı. Gerçek kural sunucuda, bu sadece hangi butonların görüneceği.
const TRANSITIONS = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};
const LABELS = { PAID: 'Mark paid', SHIPPED: 'Ship', DELIVERED: 'Deliver', CANCELLED: 'Cancel' };
const STATUSES = Object.keys(TRANSITIONS);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.get(filter ? `/orders?status=${filter}` : '/orders');
      setOrders(data ?? []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn) {
    try {
      await fn();
      await load();
    } catch (err) {
      setError(err.message); // örn. 409: geçersiz durum geçişi
    }
  }

  const changeStatus = (id, status) => act(() => api.patch(`/orders/${id}/status`, { status }));
  const remove = (id) => {
    if (window.confirm(`Delete order #${id}?`)) act(() => api.delete(`/orders/${id}`));
  };

  return (
    <>
      <div className="page-head">
        <h1>Orders</h1>
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="muted">No orders yet. Place one from the Products page.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td className="muted">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <div className="row-actions">
                    {(TRANSITIONS[o.status] ?? []).map((next) => (
                      <button
                        key={next}
                        className={`btn small ${next === 'CANCELLED' ? 'danger' : ''}`}
                        onClick={() => changeStatus(o.id, next)}
                      >
                        {LABELS[next]}
                      </button>
                    ))}
                    {(o.status === 'CREATED' || o.status === 'CANCELLED') && (
                      <button className="btn small ghost" onClick={() => remove(o.id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
