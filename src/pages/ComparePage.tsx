import { useEffect, useState } from 'react';
import { ArrowRight, Scale, X, Check } from 'lucide-react';
import { Jar } from '../components/Jar';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import type { Product, Page } from '../types';

export function ComparePage({
  products,
  navigate,
}: {
  products: Product[];
  navigate: (page: Page, params?: Record<string, string>) => void;
}) {
  const { compareIds, toggleCompare } = useStore();
  const { user } = useAuth();
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('compare')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          const ids = data.map((r) => r.product_id);
          setCompareProducts(products.filter((p) => ids.includes(p.id)));
        }
      });
  }, [user, products, compareIds]);

  if (!user) {
    return (
      <div className="page-empty">
        <Scale size={48} />
        <h2>Sign in to compare products.</h2>
        <a className="pill-button red-button" onClick={() => navigate('login')} style={{ cursor: 'pointer' }}>
          sign in <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  if (compareProducts.length === 0) {
    return (
      <div className="page-empty">
        <Scale size={48} />
        <h2>Nothing to compare yet.</h2>
        <p>Add products to compare to see them side by side.</p>
        <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          browse products <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  const rows: { label: string; get: (p: Product) => React.ReactNode }[] = [
    { label: 'Price', get: (p) => `$${p.price.toFixed(2)}` },
    { label: 'Size', get: (p) => p.size },
    { label: 'Flavour', get: (p) => p.type },
    { label: 'Spicy', get: (p) => (p.spicy ? <Check size={18} /> : <X size={18} />) },
    { label: 'Sweet', get: (p) => (p.sweet ? <Check size={18} /> : <X size={18} />) },
    { label: 'Vegan', get: (p) => (p.vegan ? <Check size={18} /> : <X size={18} />) },
    { label: 'Gluten-free', get: (p) => (p.gluten_free ? <Check size={18} /> : <X size={18} />) },
  ];

  return (
    <div className="page-compare">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> side by side</p>
        <h1>Compare<br /><em>the goods.</em></h1>
        <p>See how your favourite jars stack up.</p>
      </section>

      <div className="compare-table">
        <div className="compare-row compare-header">
          <div className="compare-label-col" />
          {compareProducts.map((p) => (
            <div className="compare-product-col" key={p.id}>
              <button className="compare-remove" onClick={() => toggleCompare(p.id)} aria-label="Remove from compare">
                <X size={16} />
              </button>
              <div className="compare-jar"><Jar product={p} size="sm" /></div>
              <h3>{p.name}</h3>
              <a className="text-link" onClick={() => navigate('product', { slug: p.slug })} style={{ cursor: 'pointer', fontSize: '10px' }}>
                view <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <div className="compare-row" key={row.label}>
            <div className="compare-label-col">{row.label}</div>
            {compareProducts.map((p) => (
              <div className="compare-value-col" key={p.id}>
                {row.get(p)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
