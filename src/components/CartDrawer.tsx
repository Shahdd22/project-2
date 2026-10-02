import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../lib/StoreContext';
import { Jar } from './Jar';
import type { Page } from '../types';

export function CartDrawer({ navigate }: { navigate: (page: Page) => void }) {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, cartCount } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" onClick={() => setCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
          <X size={22} />
        </button>
        <div className="cart-top">
          <p className="eyebrow"><span className="eyebrow-line" /> torshi pantry</p>
          <h2>Your Cart</h2>
        </div>

        {cartCount === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={38} />
            <p>Your cart is waiting for a little flavour.</p>
            <button className="pill-button red-button" onClick={() => { setCartOpen(false); navigate('products'); }}>
              keep shopping
            </button>
          </div>
        ) : (
          <div className="cart-filled">
            {cart.map((item) => (
              <div className="cart-line" key={item.product.id}>
                <div className="cart-line-jar"><Jar product={item.product} size="sm" /></div>
                <div className="cart-line-info">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.type}</p>
                  <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                </div>
                <div className="cart-line-controls">
                  <button onClick={() => updateQty(item.product.id, item.quantity - 1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.product.id, item.quantity + 1)}><Plus size={14} /></button>
                  <button className="remove-line" onClick={() => removeFromCart(item.product.id)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button
              className="checkout-button"
              onClick={() => { setCartOpen(false); navigate('checkout'); }}
            >
              checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
