import { useState } from 'react';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import type { Page } from '../types';
import { TorshiLogo } from './TorshiLogo';

export function Header({ current, navigate }: { current: Page; navigate: (page: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, setCartOpen, wishlistIds } = useStore();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const go = (page: Page) => {
    navigate(page);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'products' },
    { label: 'Our Pickles', page: 'products' },
    { label: 'Best Sellers', page: 'products' },
    { label: 'About Us', page: 'story' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="torshi-navbar-shell">
      <div className={`torshi-navbar ${menuOpen ? 'menu-open' : ''}`}>
        <button className="torshi-brand" onClick={() => go('home')} aria-label="Torshi home">
          <TorshiLogo />
        </button>

        <nav className="torshi-nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={current === item.page && item.label !== 'Our Pickles' && item.label !== 'Best Sellers' ? 'active' : ''}
              onClick={() => go(item.page)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="torshi-actions">
          <div className={`torshi-search ${searchOpen ? 'open' : ''}`}>
            <button className="torshi-icon-button" onClick={() => setSearchOpen((open) => !open)} aria-label="Search">
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
            {searchOpen && <input autoFocus type="search" placeholder="Search pickles" aria-label="Search pickles" onKeyDown={(event) => { if (event.key === 'Enter') go('products'); }} />}
          </div>
          <button className="torshi-icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="torshi-icon-button torshi-wishlist-button" onClick={() => go(user ? 'wishlist' : 'login')} aria-label="Wishlist">
            <Heart size={18} />
            {wishlistIds.length > 0 && <span className="torshi-badge">{wishlistIds.length}</span>}
          </button>
          <button className="torshi-icon-button torshi-cart-button" onClick={() => setCartOpen(true)} aria-label="Shopping cart">
            <ShoppingBag size={18} />
            <span className="torshi-badge">{cartCount}</span>
          </button>
          <button className="torshi-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
