import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product, Page } from '../types';

export function ProductsPage({ products, navigate }: { products: Product[]; navigate: (page: Page, params?: Record<string, string>) => void }) {
  const [filter, setFilter] = useState<'all' | 'spicy' | 'sweet' | 'vegan'>('all');
  const latestCreatedAt = products.reduce((latest, product) => product.created_at && product.created_at > latest ? product.created_at : latest, '');
  const bestSellerSlugs = new Set(['apricot-chutney', 'house-hot-sauce', 'cool-mint-sauce']);

  const filtered = products.filter((product) => {
    if (filter === 'spicy') return product.spicy;
    if (filter === 'sweet') return product.sweet;
    if (filter === 'vegan') return product.vegan;
    return true;
  });

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'spicy', label: 'Spicy' },
    { key: 'sweet', label: 'Sweet' },
    { key: 'vegan', label: 'Vegan' },
  ];

  return (
    <div className="page-products">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> torshi shop</p>
        <h1>Every jar,<br /><em>ready to go.</em></h1>
        <p>Pick your flavour. We'll handle the rest.</p>
      </section>

      <div className="filter-bar">
        {filters.map((filterOption) => <button key={filterOption.key} className={`filter-chip ${filter === filterOption.key ? 'active' : ''}`} onClick={() => setFilter(filterOption.key)}>{filterOption.label}</button>)}
      </div>

      <div className="products-grid premium-shop-grid">
        {filtered.map((product) => {
          const badge = product.spicy ? 'HOT' : product.created_at === latestCreatedAt && latestCreatedAt ? 'NEW' : bestSellerSlugs.has(product.slug) ? 'BEST SELLER' : undefined;
          return <ProductCard key={product.id} product={product} navigate={navigate} badge={badge} />;
        })}
      </div>
    </div>
  );
}
