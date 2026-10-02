import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { StoreProvider } from './lib/StoreContext';
import { ThemeProvider } from './lib/ThemeContext';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BackToTop } from './components/BackToTop';
import { TorshiLogo } from './components/TorshiLogo';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { StoryPage } from './pages/StoryPage';
import { LoginPage } from './pages/LoginPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { StoresPage } from './pages/StoresPage';
import { ContactPage } from './pages/ContactPage';
import type { Product, Page } from './types';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (data && !error) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const navigate = useCallback((newPage: Page, newParams: Record<string, string> = {}) => {
    setPage(newPage);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentProduct =
    page === 'product' && params.slug
      ? products.find((p) => p.slug === params.slug) ?? null
      : null;

  if (loading || authLoading) {
    return (
      <main className="site-shell">
        <div className="torshi-loading-screen" role="status" aria-label="Loading Torshi">
          <div className="loading-decoration loading-decoration-one" />
          <div className="loading-decoration loading-decoration-two" />
          <div className="loading-decoration loading-decoration-three" />
          <div className="torshi-loading-logo"><TorshiLogo /></div>
          <p>preparing the good jars</p>
          <span className="loading-progress"><i /></span>
        </div>
      </main>
    );
  }

  return (
    <main className="site-shell">
      {page !== 'login' && <Header current={page} navigate={navigate} />}

      <div className="page-content">
        {page === 'home' && <HomePage products={products} navigate={navigate} />}
        {page === 'products' && <ProductsPage products={products} navigate={navigate} />}
        {page === 'product' && <ProductDetailPage product={currentProduct} products={products} navigate={navigate} />}
        {page === 'story' && <StoryPage navigate={navigate} />}
        {page === 'recipes' && <HomePage products={products} navigate={navigate} />}
        {page === 'wishlist' && <WishlistPage products={products} navigate={navigate} />}
        {page === 'compare' && <ComparePage products={products} navigate={navigate} />}
        {page === 'checkout' && <CheckoutPage navigate={navigate} />}
        {page === 'dashboard' && <DashboardPage navigate={navigate} />}
        {page === 'stores' && <StoresPage navigate={navigate} />}
        {page === 'contact' && <ContactPage navigate={navigate} />}
        {page === 'login' && <LoginPage navigate={navigate} />}
      </div>

      {page !== 'login' && <Footer navigate={navigate} />}
      {page !== 'login' && <BackToTop />}
      <CartDrawer navigate={navigate} />
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
