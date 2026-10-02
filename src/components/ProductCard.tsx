import { useState } from 'react';
import { ArrowLeftRight, ArrowRight, Heart } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import { Jar } from './Jar';
import { useAuth } from '../lib/AuthContext';
import { useStore } from '../lib/StoreContext';
import type { Page, Product } from '../types';

type ProductBadge = 'BEST SELLER' | 'NEW' | 'HOT';

export function ProductCard({ product, navigate, badge }: { product: Product; navigate: (page: Page, params?: Record<string, string>) => void; badge?: ProductBadge }) {
  const { user } = useAuth();
  const { addToCart, isInWishlist, toggleWishlist, isInCompare, toggleCompare, cart } = useStore();
  const [showIngredients, setShowIngredients] = useState(false);
  const isAdded = cart.some((item) => item.product.id === product.id);
  const wished = isInWishlist(product.id);
  const ingredients = product.name.toLowerCase().includes('carrot')
    ? ['Carrots', 'Garlic', 'Vinegar', 'Sea salt']
    : product.name.toLowerCase().includes('cucumber')
      ? ['Cucumbers', 'Dill', 'Garlic', 'Vinegar']
      : product.name.toLowerCase().includes('lemon')
        ? ['Preserved lemons', 'Chili', 'Sea salt', 'Coriander']
        : ['Cucumbers', 'Carrots', 'Garlic', 'Vinegar', 'Sea salt'];

  return (
    <article className="premium-product-card">
      <div className="premium-product-image" onClick={() => navigate('product', { slug: product.slug })} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') navigate('product', { slug: product.slug }); }}>
        {badge && <span className={`product-badge product-badge-${badge.toLowerCase().replace(' ', '-')}`}>{badge}</span>}
        <Jar product={product} />
        <div className="premium-card-hover"><span>view details</span><ArrowRight size={12} /></div>
      </div>
      <div className="premium-product-info">
        <div className="premium-product-heading">
          <div><h3>{product.name}</h3><p>{product.type}</p></div>
          <strong>${product.price.toFixed(2)}</strong>
        </div>
        <p className="premium-product-description">{product.description}</p>
        <div className="premium-card-footer">
          <button className={`card-icon-button ${wished ? 'is-wished' : ''}`} onClick={() => user ? toggleWishlist(product.id) : navigate('login')} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
            <Heart size={13} fill={wished ? 'currentColor' : 'none'} />
          </button>
          <button className={`card-icon-button ${isInCompare(product.id) ? 'is-compared' : ''}`} onClick={() => user ? toggleCompare(product.id) : navigate('login')} aria-label="Compare product">
            <ArrowLeftRight size={13} />
          </button>
          <button className="premium-details-link" onClick={() => setShowIngredients((visible) => !visible)} aria-expanded={showIngredients}>ingredients <ArrowRight size={11} /></button>
          <AddToCartButton product={product} isInCart={isAdded} onAdd={addToCart} />
        </div>
        {showIngredients && <div className="ingredient-panel"><span>inside the jar</span><p>{ingredients.map((ingredient) => <b key={ingredient}>{ingredient}</b>)}</p><button onClick={() => navigate('product', { slug: product.slug })}>view full details <ArrowRight size={13} /></button></div>}
      </div>
    </article>
  );
}
