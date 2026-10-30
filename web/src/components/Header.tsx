import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'

export default function Header() {
  const { session, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          🛍️ Quantum<span>Shop</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {session?.role === 'ADMIN' && <NavLink to="/admin/products">Admin</NavLink>}
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-link" aria-label="Cart">
            🛒{count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          {session ? (
            <>
              <span className="user-chip">
                {session.username}
                <small>{session.role}</small>
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
