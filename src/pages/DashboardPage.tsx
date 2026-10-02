import { useEffect, useState } from 'react';
import { ArrowRight, LogOut, Package, Heart, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useStore } from '../lib/StoreContext';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem, Page } from '../types';

type OrderWithItems = Order & { items: OrderItem[] };

export function DashboardPage({ navigate }: { navigate: (page: Page) => void }) {
  const { user, signOut } = useAuth();
  const { wishlistIds, compareIds } = useStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!orderData) {
        setLoading(false);
        return;
      }

      const ordersWithItems = await Promise.all(
        orderData.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
          return { ...order, items: items ?? [] } as OrderWithItems;
        })
      );

      setOrders(ordersWithItems);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="page-empty">
        <h2>Sign in to see your dashboard.</h2>
        <a className="pill-button red-button" onClick={() => navigate('login')} style={{ cursor: 'pointer' }}>
          sign in <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="page-dashboard">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> welcome back</p>
        <h1>Hello,<br /><em>{user.email}.</em></h1>
        <p>Your good stuff headquarters.</p>
        <button className="pill-button red-button" onClick={() => signOut()} style={{ marginTop: '16px' }}>
          Sign out <LogOut size={16} />
        </button>
      </section>

      <div className="dashboard-stats">
        <div className="stat-card">
          <Package size={28} />
          <strong>{orders.length}</strong>
          <span>Orders</span>
        </div>
        <div className="stat-card">
          <Heart size={28} />
          <strong>{wishlistIds.length}</strong>
          <span>Wishlist items</span>
        </div>
        <div className="stat-card">
          <ShoppingBag size={28} />
          <strong>{compareIds.length}</strong>
          <span>Comparing</span>
        </div>
        <div className="stat-card">
          <Clock size={28} />
          <strong>${totalSpent.toFixed(2)}</strong>
          <span>Total spent</span>
        </div>
      </div>

      <section className="dashboard-orders">
        <h2>Order history</h2>

        {loading ? (
          <p className="dashboard-loading">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="dashboard-empty-orders">
            <p>No orders yet — your pantry is waiting.</p>
            <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
              start shopping <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <strong>Order #{order.id.slice(0, 8)}</strong>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="order-status">{order.status}</div>
                  <strong className="order-total">${Number(order.total).toFixed(2)}</strong>
                </div>
                <div className="order-items-list">
                  {order.items.map((item) => (
                    <div className="order-item-row" key={item.id}>
                      <span>{item.product_name}</span>
                      <span>×{item.quantity}</span>
                      <span>${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="dashboard-quick-links">
        <a className="quick-link" onClick={() => navigate('wishlist')} style={{ cursor: 'pointer' }}>
          <Heart size={20} /> My wishlist
        </a>
        <a className="quick-link" onClick={() => navigate('compare')} style={{ cursor: 'pointer' }}>
          <ShoppingBag size={20} /> Compare list
        </a>
        <a className="quick-link" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          <Package size={20} /> Keep shopping
        </a>
      </div>
    </div>
  );
}
