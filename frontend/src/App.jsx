import React, { useMemo, useState } from 'react';
import './App.css';

const categories = [
{ name: 'Elektronik', icon: '💻', count: 128 },
{ name: 'Moda', icon: '👕', count: 245 },
{ name: 'Ev & Yaşam', icon: '🛋️', count: 189 },
{ name: 'Kozmetik', icon: '🧴', count: 87 },
{ name: 'Spor & Outdoor', icon: '⚽', count: 142 },
{ name: 'Oyuncak', icon: '🧸', count: 64 },
];

const initialProducts = [
{
id: 1,
name: 'MacBook Air M2',
category: 'Elektronik',
price: 28999,
oldPrice: 34999,
rating: 4.8,
reviews: 124,
badge: 'İndirim',
image:
'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
},
{
id: 2,
name: 'AirPods Pro 2',
category: 'Elektronik',
price: 11999,
oldPrice: null,
rating: 4.7,
reviews: 98,
badge: 'Yeni',
image:
'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
},
{
id: 3,
name: 'iPhone 15 128GB',
category: 'Elektronik',
price: 42999,
oldPrice: 49999,
rating: 4.6,
reviews: 87,
badge: 'İndirim',
image:
'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
},
{
id: 4,
name: 'Samsung Galaxy Watch',
category: 'Elektronik',
price: 8999,
oldPrice: null,
rating: 4.5,
reviews: 76,
badge: 'Çok Satan',
image:
'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
},
{
id: 5,
name: 'Nike Sırt Çantası',
category: 'Moda',
price: 2499,
oldPrice: null,
rating: 4.4,
reviews: 62,
badge: null,
image:
'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
},
];

const formatPrice = (price) =>
new Intl.NumberFormat('tr-TR', {
style: 'currency',
currency: 'TRY',
maximumFractionDigits: 0,
}).format(price);

export default function App() {
const [products] = useState(initialProducts);
const [cart, setCart] = useState([]);
const [search, setSearch] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Tümü');
const [showCart, setShowCart] = useState(false);

const filteredProducts = useMemo(() => {
return products.filter((product) => {
const matchesSearch = product.name
.toLocaleLowerCase('tr-TR')
.includes(search.toLocaleLowerCase('tr-TR'));

  const matchesCategory =
    selectedCategory === 'Tümü' ||
    product.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

}, [products, search, selectedCategory]);

const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

const cartTotal = cart.reduce(
(total, item) => total + item.price * item.quantity,
0
);

function addToCart(product) {
setCart((currentCart) => {
const existing = currentCart.find((item) => item.id === product.id);

  if (existing) {
    return currentCart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [...currentCart, { ...product, quantity: 1 }];
});

}

function changeQuantity(productId, amount) {
setCart((currentCart) =>
currentCart
.map((item) =>
item.id === productId
? { ...item, quantity: item.quantity + amount }
: item
)
.filter((item) => item.quantity > 0)
);
}

return (
<div className="shop">
<header className="header">
<a className="brand" href="#home" aria-label="QuantumShop ana sayfa">
<span className="brand-icon">Q</span>
<span>Quantum<span className="brand-accent">Shop</span></span>
</a>

    <label className="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Ürün, kategori veya marka ara..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Ürün ara"
      />
    </label>

    <nav className="navigation">
      <a className="active" href="#home">Ana Sayfa</a>
      <a href="#categories">Kategoriler</a>
      <a href="#products">Ürünler</a>
      <a href="#footer">Hakkımızda</a>
    </nav>

    <button
      className="cart-button"
      onClick={() => setShowCart(!showCart)}
      aria-label="Alışveriş sepetini aç"
    >
      <span className="cart-icon">🛒</span>
      <span className="cart-badge">{cartCount}</span>
      <span className="cart-label">
        <strong>Sepetim</strong>
        <small>{formatPrice(cartTotal)}</small>
      </span>
    </button>
  </header>

  <main>
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="eyebrow">TEKNOLOJİ · MODA · EV YAŞAMI</span>
        <h1>Hayalindeki Ürünler<br />Şimdi Daha Yakın!</h1>
        <p>
          QuantumShop ile kaliteli ürünleri keşfet,
          <br className="desktop-break" />
          avantajlı fiyatlarla alışverişin keyfini yaşa.
        </p>
        <a href="#products" className="primary-button">
          Alışverişe Başla <span>→</span>
        </a>
      </div>

      <div className="hero-visual">
        <div className="hero-orb">%</div>
        <div className="hero-discount">
          <strong>%50&apos;ye</strong>
          <span>Varan</span>
          <span>İndirim</span>
        </div>
        <div className="hero-symbol" aria-hidden="true">✦</div>
      </div>
    </section>

    <section className="categories-section" id="categories">
      <div className="section-heading">
        <div>
          <span className="section-kicker">SENİN İÇİN SEÇTİK</span>
          <h2>Kategorileri Keşfet</h2>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <button
            className={`category-card ${
              selectedCategory === category.name ? 'selected' : ''
            }`}
            key={category.name}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.name
                  ? 'Tümü'
                  : category.name
              )
            }
          >
            <span className="category-icon">{category.icon}</span>
            <strong>{category.name}</strong>
            <small>{category.count} ürün</small>
          </button>
        ))}
      </div>
    </section>

    <section className="products-section" id="products">
      <div className="section-heading product-heading">
        <div>
          <span className="section-kicker">FAVORİLERİN</span>
          <h2>Öne Çıkan Ürünler</h2>
        </div>

        <button
          className="text-button"
          onClick={() => {
            setSelectedCategory('Tümü');
            setSearch('');
          }}
        >
          Tüm Ürünleri Gör <span>→</span>
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              {product.badge && (
                <span
                  className={`product-badge ${
                    product.badge === 'Yeni' ? 'badge-new' : ''
                  }`}
                >
                  {product.badge}
                </span>
              )}
              <img src={product.image} alt={product.name} loading="lazy" />
            </div>

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="rating">
                <span>★★★★★</span>
                <small>
                  {product.rating} ({product.reviews})
                </small>
              </div>

              <div className="price-row">
                {product.oldPrice && (
                  <del>{formatPrice(product.oldPrice)}</del>
                )}
                <strong>{formatPrice(product.price)}</strong>
              </div>

              <button
                className="add-button"
                onClick={() => addToCart(product)}
              >
                <span>🛒</span> Sepete Ekle
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-results">
          <span>🔎</span>
          <h3>Aradığın ürün bulunamadı</h3>
          <p>Başka bir ürün adı veya kategori deneyebilirsin.</p>
          <button
            className="primary-button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('Tümü');
            }}
          >
            Tüm Ürünleri Göster
          </button>
        </div>
      )}
    </section>

    {showCart && (
      <div className="cart-overlay" onClick={() => setShowCart(false)}>
        <aside
          className="cart-panel"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="cart-panel-header">
            <div>
              <span className="section-kicker">ALIŞVERİŞİN</span>
              <h2>Sepetim ({cartCount})</h2>
            </div>
            <button
              className="close-button"
              onClick={() => setShowCart(false)}
              aria-label="Sepeti kapat"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>🛍️</span>
              <h3>Sepetin henüz boş</h3>
              <p>Beğendiğin ürünleri sepete ekleyerek başlayabilirsin.</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span>{formatPrice(item.price)}</span>
                      <div className="quantity-control">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`${item.name} miktarını azalt`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`${item.name} miktarını artır`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Toplam</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <button
                className="add-button checkout-button"
                onClick={() =>
                  window.alert(
                    'Sepet hazır! Bir sonraki aşamada sipariş API bağlantısını ekleyeceğiz.'
                  )
                }
              >
                Siparişe Devam Et →
              </button>
            </>
          )}
        </aside>
      </div>
    )}
  </main>

  <footer className="footer" id="footer">
    <a className="brand footer-brand" href="#home">
      <span className="brand-icon">Q</span>
      <span>Quantum<span className="brand-accent">Shop</span></span>
    </a>
    <p>Akıllı alışveriş, avantajlı seçimler.</p>
    <span>© 2026 QuantumShop · Portfolio Project</span>
  </footer>
</div>

);
}