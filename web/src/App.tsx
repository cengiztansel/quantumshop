
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Catalog from './pages/Catalog'

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="*" element={<Catalog />} />
        </Routes>
      </main>
    </>
  )
}

