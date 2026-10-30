import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { session, login, register } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={from} replace />

  const set = (field: 'username' | 'email' | 'password') => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(form.username, form.password)
      else await register(form.username, form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2 style={{ margin: 0 }}>🛍️ QuantumShop</h2>
        <p className="muted" style={{ margin: 0 }}>
          {mode === 'login' ? 'Sign in to place and track orders' : 'Create your account'}
        </p>
        {error && <div className="alert alert-error" style={{ margin: 0 }}>{error}</div>}

        <label>
          Username
          <input className="input" value={form.username} onChange={set('username')} required autoFocus />
        </label>
        {mode === 'register' && (
          <label>
            Email
            <input className="input" type="email" value={form.email} onChange={set('email')} required />
          </label>
        )}
        <label>
          Password
          <input className="input" type="password" value={form.password} onChange={set('password')} required />
        </label>

        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
        >
          {mode === 'login' ? 'No account? Register' : 'Have an account? Sign in'}
        </button>
        <Link to="/" className="muted" style={{ textAlign: 'center' }}>Continue as guest</Link>
      </form>
    </div>
  )
}
