import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import type { Product, CartItem } from '../types';

type StoreContextType = {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  compareIds: string[];
  toggleCompare: (productId: string) => Promise<void>;
  isInCompare: (productId: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Load wishlist + compare when user logs in
  useEffect(() => {
    if (!user) {
      setWishlistIds([]);
      setCompareIds([]);
      return;
    }

    supabase.from('wishlist').select('product_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setWishlistIds(data.map((r) => r.product_id));
    });

    supabase.from('compare').select('product_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setCompareIds(data.map((r) => r.product_id));
    });
  }, [user]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!user) return;
      if (wishlistIds.includes(productId)) {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        setWishlistIds((prev) => [...prev, productId]);
        await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      }
    },
    [user, wishlistIds]
  );

  const toggleCompare = useCallback(
    async (productId: string) => {
      if (!user) return;
      if (compareIds.includes(productId)) {
        setCompareIds((prev) => prev.filter((id) => id !== productId));
        await supabase.from('compare').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        if (compareIds.length >= 4) return;
        setCompareIds((prev) => [...prev, productId]);
        await supabase.from('compare').insert({ user_id: user.id, product_id: productId });
      }
    },
    [user, compareIds]
  );

  const isInWishlist = useCallback((id: string) => wishlistIds.includes(id), [wishlistIds]);
  const isInCompare = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        cartCount,
        cartTotal,
        clearCart,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        compareIds,
        toggleCompare,
        isInCompare,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
