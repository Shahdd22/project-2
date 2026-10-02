import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Minus, Plus, Scale, ShoppingBag, ArrowLeft, Citrus, Flame, Leaf, Sparkles, Utensils } from 'lucide-react';
import { Jar } from '../components/Jar';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import type { Product, Page } from '../types';

export function ProductDetailPage({
  product,
  products,
  navigate,
}: {
  product: Product | null;
  products: Product[];
  navigate: (page: Page, params?: Record<string, string>) => void;
}) {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product]);

  if (!product) {
    return (
      <div className="page-empty">
        <h2>Product not found.</h2>
        <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          back to shop <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="page-product-detail">
      <button className="back-link" onClick={() => navigate('products')}>
        <ArrowLeft size={16} /> back to shop
      </button>

      <div className="detail-grid">
        <div className="detail-jar-area">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="floating-star star-one">✦</div>
          <Jar product={product} featured />
        </div>

        <div className="detail-info">
          <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> {product.type}</p>
          <h1>{product.name}</h1>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-tags">
            {product.spicy && <span className="tag tag-spicy">Spicy</span>}
            {product.sweet && <span className="tag tag-sweet">Sweet</span>}
            {product.vegan && <span className="tag tag-vegan">Vegan</span>}
            {product.gluten_free && <span className="tag tag-gf">Gluten-free</span>}
          </div>

          <div className="detail-price-row">
            <strong className="detail-price">${product.price.toFixed(2)}</strong>
            <span className="detail-size">{product.size}</span>
          </div>

          <div className="detail-qty-row">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}><Plus size={16} /></button>
            </div>
            <button className="pill-button red-button" onClick={() => addToCart(product, qty)}>
              Add to bag <ShoppingBag size={16} />
            </button>
          </div>

          <div className="detail-extra-actions">
            <button
              className={`icon-action ${isInWishlist(product.id) ? 'active-wish' : ''}`}
              onClick={() => user ? toggleWishlist(product.id) : navigate('login')}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              {isInWishlist(product.id) ? 'In wishlist' : 'Add to wishlist'}
            </button>
            <button
              className={`icon-action ${isInCompare(product.id) ? 'active-cmp' : ''}`}
              onClick={() => user ? toggleCompare(product.id) : navigate('login')}
            >
              <Scale size={18} />
              {isInCompare(product.id) ? 'In compare' : 'Add to compare'}
            </button>
          </div>
        </div>
      </div>

      <section className="made-section">
        <div className="made-heading">
          <p className="eyebrow" style={{ color: 'var(--red)', justifyContent: 'center' }}><span className="eyebrow-line" /> inside the jar</p>
          <h2>Made from<br /><em>good things.</em></h2>
          <p>Every layer has a job. Hover the ingredients to see the little details that make this jar taste so good.</p>
        </div>
        <div className="ingredient-orbit">
          <div className="ingredient-ring ring-outer" />
          <div className="ingredient-ring ring-inner" />
          <div className="ingredient-center"><Jar product={product} featured /></div>
          <div className="ingredient-node node-apricot"><span className="ingredient-icon"><Citrus size={25} /></span><strong>Apricots</strong><small>sunny + sweet</small></div>
          <div className="ingredient-node node-herbs"><span className="ingredient-icon"><Leaf size={25} /></span><strong>Fresh herbs</strong><small>garden bright</small></div>
          <div className="ingredient-node node-spice"><span className="ingredient-icon"><Flame size={25} /></span><strong>Warm spice</strong><small>just a little kick</small></div>
          <div className="ingredient-node node-craft"><span className="ingredient-icon"><Sparkles size={25} /></span><strong>Small batch</strong><small>made with care</small></div>
        </div>
        <div className="process-steps">
          <div className="process-step"><span>01</span><Utensils size={20} /><h3>Prep</h3><p>Real ingredients, carefully selected.</p></div>
          <div className="process-step"><span>02</span><Flame size={20} /><h3>Cook</h3><p>Slow heat brings out the good stuff.</p></div>
          <div className="process-step"><span>03</span><Sparkles size={20} /><h3>Jar</h3><p>Sealed while it's still full of flavour.</p></div>
        </div>
      </section>

      <section className="related-section">
        <h2>You might<br /><em>also like.</em></h2>
        <div className="related-grid">
          {related.map((p) => (
            <div className="related-card" key={p.id} onClick={() => navigate('product', { slug: p.slug })} style={{ cursor: 'pointer' }}>
              <Jar product={p} size="sm" />
              <h3>{p.name}</h3>
              <p>{p.type}</p>
              <strong>${p.price.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
