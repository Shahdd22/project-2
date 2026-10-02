import { useState } from 'react';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Jar } from '../components/Jar';
import type { Page } from '../types';

export function CheckoutPage({ navigate }: { navigate: (page: Page) => void }) {
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    name: '',
    email: user?.email ?? '',
    address: '',
    city: '',
    postal: '',
    country: 'Canada',
  });

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('login');
      return;
    }
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: user.id, total: cartTotal, status: 'pending' })
        .select()
        .single();

      if (orderError) throw orderError;

      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      clearCart();
      setPlaced(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong placing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="page-empty">
        <div className="order-success-icon"><Check size={56} /></div>
        <h2>Order placed!</h2>
        <p>Your good stuff is on its way. Check your dashboard for updates.</p>
        <a className="pill-button red-button" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          go to dashboard <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page-empty">
        <ShoppingBag size={48} />
        <h2>Your bag is empty.</h2>
        <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          start shopping <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  return (
    <div className="page-checkout">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> almost there</p>
        <h1>Check<em>out.</em></h1>
        <p>One last step before the good stuff is yours.</p>
      </section>

      <div className="checkout-grid">
        <div className="checkout-form-area">
          {!user && (
            <div className="checkout-login-prompt">
              <p>You'll need to sign in to place your order.</p>
              <a className="pill-button red-button" onClick={() => navigate('login')} style={{ cursor: 'pointer' }}>
                sign in <ArrowRight size={16} />
              </a>
            </div>
          )}

          <h2 className="checkout-section-title">Shipping details</h2>
          <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
            <label>
              <span>Full name</span>
              <input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} required />
            </label>
            <label>
              <span>Address</span>
              <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required />
            </label>
            <div className="form-row">
              <label>
                <span>City</span>
                <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
              </label>
              <label>
                <span>Postal code</span>
                <input value={shipping.postal} onChange={(e) => setShipping({ ...shipping, postal: e.target.value })} required />
              </label>
            </div>
            <label>
              <span>Country</span>
              <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} required />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="pill-button red-button checkout-submit" disabled={loading || !user}>
              {loading ? 'Placing order...' : `Place order — $${cartTotal.toFixed(2)}`}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </div>

        <div className="checkout-summary-area">
          <h2 className="checkout-section-title">Your order</h2>
          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.product.id}>
                <div className="checkout-item-jar"><Jar product={item.product} size="sm" /></div>
                <div className="checkout-item-info">
                  <h3>{item.product.name}</h3>
                  <p>Qty: {item.quantity}</p>
                  <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
            <div><span>Shipping</span><strong>{cartTotal >= 45 ? 'Free' : '$5.00'}</strong></div>
            <div className="checkout-total-row">
              <span>Total</span>
              <strong>${(cartTotal + (cartTotal >= 45 ? 0 : 5)).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
