import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createProduct, deleteProduct, updateProduct } from '../api/shop'
import { useProducts } from '../hooks/useProducts'
import { formatPrice } from '../lib/format'
import type { Product, ProductInput } from '../types'

interface FormState {
  sku: string
  name: string
  description: string
  price: string
  stock: string
}

const EMPTY: FormState = { sku: '', name: '', description: '', price: '', stock: '' }

function toForm(p: Product): FormState {
  return { sku: p.sku, name: p.name, description: p.description, price: String(p.price), stock: String(p.stock) }
}

// İstemci tarafı doğrulama: sunucudaki ProductRequest kurallarının aynası (asıl doğrulama sunucuda)
function validate(form: FormState, products: Product[], editingId: number | null): string | null {
  const sku = form.sku.trim()
  const name = form.name.trim()
  const price = Number(form.price)
  const stock = Number(form.stock)
  if (!sku) return 'SKU is required'
  if (!name) return 'Name is required'
  if (name.length > 150) return 'Name must be at most 150 characters'
  if (!form.price.trim() || !Number.isFinite(price) || price <= 0) return 'Price must be greater than 0'
  if (!form.stock.trim() || !Number.isInteger(stock) || stock < 0) return 'Stock must be a whole number, 0 or more'
  const duplicate = products.some((p) => p.id !== editingId && p.sku.toLowerCase() === sku.toLowerCase())
  if (duplicate) return `SKU "${sku}" is already used by another product`
  return null
}

export default function AdminProducts() {
  const { products, loading, error: loadError, reload } = useProducts()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const set = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm(toForm(p))
    setError('')
    setNotice('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    setEditingId(null)
    setForm(EMPTY)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')
    const problem = validate(form, products, editingId)
    if (problem) {
      setError(problem)
      return
    }

    const input: ProductInput = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stock),
    }

    setBusy(true)
    try {
      if (editingId === null) {
        const created = await createProduct(input)
        setNotice(`Product "${created.name}" created (id ${created.id}).`)
      } else {
        await updateProduct(editingId, input)
        setNotice(`Product "${input.name}" updated.`)
      }
      reset()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: Product) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setError('')
    setNotice('')
    try {
      await deleteProduct(p.id)
      setNotice(`Product "${p.name}" deleted.`)
      if (editingId === p.id) reset()
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <>
      <h2>Manage products</h2>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loadError && <div className="alert alert-error">{loadError}</div>}

      <form className="panel" onSubmit={submit} style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 14 }}>{editingId === null ? 'New product' : `Edit product #${editingId}`}</h3>
        <div className="form-grid">
          <label>
            SKU
            <input className="input" value={form.sku} onChange={set('sku')} placeholder="e.g. AUD-JBL-001" />
          </label>
          <label>
            Name
            <input className="input" value={form.name} onChange={set('name')} maxLength={150} />
          </label>
          <label>
            Price
            <input className="input" type="number" step="0.01" min="0.01" value={form.price} onChange={set('price')} />
          </label>
          <label>
            Stock
            <input className="input" type="number" step="1" min="0" value={form.stock} onChange={set('stock')} />
          </label>
          <label className="full">
            Description
            <textarea className="input" value={form.description} onChange={set('description')} />
          </label>
        </div>
        <p className="muted small">
          Image (optional): add <code>public/products/&lt;SKU&gt;.jpg</code> to the web project. Without it a colored placeholder is shown.
        </p>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : editingId === null ? 'Create product' : 'Save changes'}
          </button>
          {editingId !== null && (
            <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>

      <div className="panel table-wrap">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => startEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
