import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          🛍️ Quantum<span>Shop</span>
        </Link>
      </div>
    </header>
  )
}
