import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './lib/AuthContext';
import { StoreProvider } from './lib/StoreContext';
import { ThemeProvider } from './lib/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BackToTop } from './components/BackToTop';
import { StoresPage } from './pages/StoresPage';
import type { Page } from './types';
import './index.css';

const navigate = (page: Page) => {
  window.location.href = page === 'home' ? 'index.html' : 'index.html';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
        <main className="site-shell stores-site-shell">
          <Header current="stores" navigate={navigate} />
          <StoresPage navigate={navigate} />
          <Footer navigate={navigate} />
          <BackToTop />
          <CartDrawer navigate={navigate} />
        </main>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
