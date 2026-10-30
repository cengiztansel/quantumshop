import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { categoryInfo } from '../lib/format'

const STACK = [
  'Java 21', 'Spring Boot 3', 'Spring Cloud Gateway', 'Eureka', 'RabbitMQ',
  'PostgreSQL', 'Redis', 'Kubernetes', 'React', 'TypeScript',
]

export default function Home() {
  const { products, loading, error } = useProducts()

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    return [...counts.entries()]
  }, [products])

  return (
    <>
      <section className="hero">
        <span className="pill">Cloud-native Kubernetes project</span>
        <h1>Shop on a microservices platform built for the cloud</h1>
        <h2>Author:  cengiztansel ertokatli</h2>
        <p>
          Browse the catalog, build a cart and place orders. Every request flows through an API gateway
          to Spring Boot services running on Kubernetes.
        </p>
        <div className="hero-cta">
          <Link to="/shop" className="btn btn-light">Shop now</Link>
          <a
            className="btn btn-outline-light"
            href="https://github.com/cengiztansel/quantumshop"
            target="_blank"
            rel="noreferrer"
          >
            View source
          </a>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <section>
        <h2>Shop by category</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <div className="tiles">
            {categories.map(([code, count]) => {
              const info = categoryInfo(code)
              return (
                <Link key={code} to={`/shop?category=${code}`} className="tile">
                  <span className="icon">{info.icon}</span>
                  <strong>{info.label}</strong>
                  <span className="muted">{count} {count === 1 ? 'product' : 'products'}</span>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2>Featured products</h2>
        <div className="grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Under the hood</h2>
        <p className="muted">The storefront you are looking at is backed by real services:</p>
        <div className="stack-list">
          {STACK.map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>
      </section>
    </>
  )
}
