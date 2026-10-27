import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';

function Layout() {
  const { session, logout } = useAuth();
  if (!session) return <Navigate to="/login" replace />;

  return (
    <>
      <header className="topbar">
        <span className="brand">QuantumShop</span>
        <nav>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
        <div className="user">
          <span>{session.username}</span>
          <span className="role">{session.role}</span>
          <button className="btn ghost small" onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
