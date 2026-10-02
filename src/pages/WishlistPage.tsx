import { ArrowRight, Heart, Plus, Trash2 } from 'lucide-react';
import { Jar } from '../components/Jar';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import type { Product, Page } from '../types';

export function WishlistPage({
  products,
  navigate,
}: {
  products: Product[];
  navigate: (page: Page, params?: Record<string, string>) => void;
}) {
  const { wishlistIds, toggleWishlist, addToCart } = useStore();
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          const ids = data.map((r) => r.product_id);
          setWishlistProducts(products.filter((p) => ids.includes(p.id)));
        }
      });
  }, [user, products, wishlistIds]);

  if (!user) {
    return (
      <div className="page-empty">
        <Heart size={48} />
        <h2>Sign in to see your wishlist.</h2>
        <a className="pill-button red-button" onClick={() => navigate('login')} style={{ cursor: 'pointer' }}>
          sign in <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="page-empty">
        <Heart size={48} />
        <h2>Your wishlist is empty.</h2>
        <p>Start adding jars you love.</p>
        <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          browse products <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  return (
    <div className="page-wishlist">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> saved for later</p>
        <h1>Your<br /><em>wishlist.</em></h1>
        <p>{wishlistProducts.length} jar{wishlistProducts.length !== 1 ? 's' : ''} you've got your eye on.</p>
      </section>

      <div className="products-grid">
        {wishlistProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card-jar" onClick={() => navigate('product', { slug: product.slug })} style={{ cursor: 'pointer' }}>
              <Jar product={product} />
            </div>
            <div className="product-card-info">
              <h3>{product.name}</h3>
              <p className="product-card-type">{product.type}</p>
              <div className="product-card-bottom">
                <strong>${product.price.toFixed(2)}</strong>
                <div className="product-card-actions">
                  <button className="add-btn" onClick={() => addToCart(product)}><Plus size={16} /></button>
                  <button className="icon-action-sm active-wish" onClick={() => toggleWishlist(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
