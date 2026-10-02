import { useState, useEffect } from 'react';
import { ArrowLeftRight, ChevronLeft, ChevronRight, Heart, Plus, ArrowRight, ChefHat, Citrus, Sparkles } from 'lucide-react';
import { Jar } from './Jar';
import { useStore } from '../lib/StoreContext';
import { useAuth } from '../lib/AuthContext';
import type { Product, Page } from '../types';

export function ProductCarousel({
  products,
  navigate,
}: {
  products: Product[];
  navigate: (page: Page, params?: Record<string, string>) => void;
}) {
  const [center, setCenter] = useState(0);
  const [direction, setDirection] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  const { user } = useAuth();

  const move = (dir: number) => {
    setDirection(dir);
    setCenter((c) => (c + dir + products.length) % products.length);
  };

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCenter((c) => (c + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [products.length]);

  const leftIdx = (center - 1 + products.length) % products.length;
  const rightIdx = (center + 1) % products.length;
  const centerProduct = products[center];

  return (
    <div className="carousel-section" id="shop">
      <div className="carousel-stage">
        <button className="round-arrow carousel-arrow-left" onClick={() => move(-1)} aria-label="Previous">
          <ChevronLeft size={22} />
        </button>

        <div className="carousel-track">
          {/* Left product - smaller */}
          <div
            className="carousel-side carousel-side-left"
            key={`left-${leftIdx}`}
            onClick={() => { setDirection(-1); setCenter(leftIdx); }}
          >
            <Jar product={products[leftIdx]} />
          </div>

          {/* Center product - large */}
          <div className="carousel-center" key={`center-${center}`}>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-star star-one">✦</div>
            <div className="orbit-icon orbit-icon-left"><ChefHat size={30} strokeWidth={1.4} /></div>
            <div className="orbit-icon orbit-icon-right"><Citrus size={30} strokeWidth={1.4} /></div>
            <div className="orbit-icon orbit-icon-top"><Sparkles size={24} strokeWidth={1.4} /></div>
            <div className={`carousel-jar-anim ${direction > 0 ? 'slide-from-right' : 'slide-from-left'}`}>
              <Jar product={centerProduct} featured />
            </div>
            <div className="product-detail">
              <p className="product-number">0{center + 1} / 0{products.length}</p>
              <h3>{centerProduct.name}</h3>
              <p>{centerProduct.type} · {centerProduct.size}</p>
              <p className="product-desc">{centerProduct.description}</p>
              <div className="product-actions-row">
                <div className="product-buy">
                  <strong>${centerProduct.price.toFixed(2)}</strong>
                  <button onClick={() => addToCart(centerProduct)}>Add to bag <Plus size={16} /></button>
                </div>
                <div className="product-icon-actions">
                  <button
                    className={`icon-action ${isInWishlist(centerProduct.id) ? 'active-wish' : ''}`}
                    onClick={() => user ? toggleWishlist(centerProduct.id) : navigate('login')}
                    aria-label="Toggle wishlist"
                  >
                    <Heart size={18} fill={isInWishlist(centerProduct.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className={`icon-action ${isInCompare(centerProduct.id) ? 'active-cmp' : ''}`}
                    onClick={() => user ? toggleCompare(centerProduct.id) : navigate('login')}
                    aria-label="Toggle compare"
                  >
                    <ArrowLeftRight size={18} />
                  </button>
                </div>
              </div>
              <button className="view-product-button" style={{ backgroundColor: centerProduct.color }} onClick={() => navigate('product', { slug: centerProduct.slug })}>
                <span>view product</span><ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right product - smaller */}
          <div
            className="carousel-side carousel-side-right"
            key={`right-${rightIdx}`}
            onClick={() => { setDirection(1); setCenter(rightIdx); }}
          >
            <Jar product={products[rightIdx]} />
          </div>
        </div>

        <button className="round-arrow carousel-arrow-right" onClick={() => move(1)} aria-label="Next">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {products.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === center ? 'active' : ''}`}
            onClick={() => { setDirection(i > center ? 1 : -1); setCenter(i); }}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
