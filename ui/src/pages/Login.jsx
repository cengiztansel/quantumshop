import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const { session, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/products" replace />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(form.username, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/products', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h1>QuantumShop</h1>
        <p className="muted">{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</p>
        {error && <div className="alert error">{error}</div>}

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

        <button className="btn" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
        >
          {mode === 'login' ? 'No account? Register' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
