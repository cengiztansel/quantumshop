import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Header from './components/Header'
import AdminProducts from './pages/AdminProducts'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Home from './pages/Home'
import Login from './pages/Login'
import Orders from './pages/Orders'
import ProductDetail from './pages/ProductDetail'

function Shell() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}

function RequireAuth() {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// Bu sadece arayüz kolaylığı; asıl yetki kontrolü gateway'de (ADMIN değilse 403)
function RequireRole({ role }: { role: string }) {
  const { session } = useAuth()
  if (session?.role !== role) {
    return <div className="alert alert-error">You need the {role} role to view this page.</div>
  }
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Catalog />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<RequireAuth />}>
          <Route path="orders" element={<Orders />} />
          <Route element={<RequireRole role="ADMIN" />}>
            <Route path="admin/products" element={<AdminProducts />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
