import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

// Product API'sinin alan adlarını burada tek yerde eşliyoruz.
// Gerçek JSON farklıysa sadece bu fonksiyonu düzeltmen yeterli.
function normalize(p) {
  return {
    id: p.id,
    name: String(p.name ?? p.productName ?? p.title ?? `Product ${p.id}`),
    description: p.description ?? '',
    price: p.price ?? p.unitPrice ?? null,
    stock: p.stockQuantity ?? p.stock_quantity ?? p.stock ?? null,
  };
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    let cancelled = false;
    api
      .get('/products')
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.content ?? []; // sayfalı yanıta da dayanıklı
        setProducts(list.map(normalize));
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  async function order(p) {
    setError('');
    setNotice('');
    const quantity = Number(quantities[p.id] ?? 1);
    try {
      const created = await api.post('/orders', { productName: p.name, quantity });
      setNotice(`Order #${created.id} created: ${quantity} × ${p.name}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Products</h1>
        <input
          className="input search"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {notice && <div className="alert success">{notice}</div>}
      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No products found.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <article className="card" key={p.id}>
              <h3>{p.name}</h3>
              {p.description && <p className="muted">{p.description}</p>}
              <div className="meta">
                {p.price !== null && (
                  <strong>{Number(p.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong>
                )}
                {p.stock !== null && <span className="muted">Stock: {p.stock}</span>}
              </div>
              <div className="actions">
                <input
                  className="input qty"
                  type="number"
                  min="1"
                  value={quantities[p.id] ?? 1}
                  onChange={(e) => setQuantities({ ...quantities, [p.id]: e.target.value })}
                />
                <button className="btn" onClick={() => order(p)}>Order</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
