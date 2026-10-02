import { useState } from 'react';
import { Check, Leaf, Plus, Sparkles } from 'lucide-react';
import type { Product } from '../types';

export function AddToCartButton({ product, isInCart, onAdd }: { product: Product; isInCart: boolean; onAdd: (product: Product) => void }) {
  const [animating, setAnimating] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 1500);
  };

  return (
    <button
      className={`add-to-cart-animated ${isInCart ? 'is-added' : ''} ${animating ? 'is-animating' : ''}`}
      onClick={handleAdd}
      aria-label={isInCart ? `Add another ${product.name}` : `Add ${product.name} to cart`}
      title={isInCart ? 'Add another one' : 'Add to cart'}
    >
      <span className="add-to-cart-icon">{isInCart ? <Check size={14} /> : <Plus size={14} />}</span>
      <span className="floating-ingredients" aria-hidden="true">
        <span className="float-ingredient ingredient-carrot" />
        <span className="float-ingredient ingredient-cucumber" />
        <span className="float-ingredient ingredient-garlic" />
        <span className="float-ingredient ingredient-chili" />
        <Leaf className="float-ingredient ingredient-mint" size={12} />
        <Sparkles className="float-ingredient ingredient-sparkle" size={11} />
      </span>
    </button>
  );
}
