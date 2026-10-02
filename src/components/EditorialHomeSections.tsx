import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Instagram, Star } from 'lucide-react';
import type { Page, Product } from '../types';
import { Jar } from './Jar';

const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/37918392/pexels-photo-37918392.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Colorful jars of vegetable spreads on a wooden tray',
    label: 'weeknight spread',
  },
  {
    src: 'https://images.pexels.com/photos/5085776/pexels-photo-5085776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'A colorful picnic spread with vegetables and dips',
    label: 'good things outdoors',
  },
  {
    src: 'https://images.pexels.com/photos/6588383/pexels-photo-6588383.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Homemade jam, fruit, cheese, and cookies on a table',
    label: 'slow afternoon',
  },
];

const reviews = [
  { name: 'Kyla S.', quote: 'The spicy beans and extra hot harseradish are the perfect combo for elevating your caesars.', color: 'blue' },
  { name: 'Drew M.', quote: 'The cabernet sauvignon cranberry sauce is rich, tangy and dangerously goblet-worthy.', color: 'red' },
  { name: 'Jim D.', quote: 'My turkey sandwiches are not complete without a little extra good stuff on top.', color: 'red' },
];

function useScrollDirectionReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.78 && bounds.bottom > window.innerHeight * 0.2) {
        setDirection(window.scrollY >= lastScrollY.current ? 'down' : 'up');
      }
      lastScrollY.current = window.scrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { sectionRef, direction };
}

export function EditorialHomeSections({ products, navigate }: { products: Product[]; navigate: (page: Page, params?: Record<string, string>) => void }) {
  const { sectionRef, direction } = useScrollDirectionReveal();
  const [activeReview, setActiveReview] = useState(0);
  const [reviewDirection, setReviewDirection] = useState(1);
  const [isChanging, setIsChanging] = useState(false);
  const touchStartX = useRef(0);
  const activeProduct = products[0];

  const changeReview = useCallback((step: number) => {
    if (isChanging) return;
    setReviewDirection(step);
    setIsChanging(true);
    window.setTimeout(() => {
      setActiveReview((current) => (current + step + reviews.length) % reviews.length);
      setIsChanging(false);
    }, 360);
  }, [isChanging]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top > window.innerHeight || bounds.bottom < 0) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); changeReview(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); changeReview(1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changeReview, sectionRef]);

  const onTouchStart = (event: React.TouchEvent) => { touchStartX.current = event.touches[0].clientX; };
  const onTouchEnd = (event: React.TouchEvent) => {
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) changeReview(delta > 0 ? -1 : 1);
  };

  return (
    <div className={`editorial-home-sections reveal-${direction}`} ref={sectionRef}>
      <section className="mainstays-section">
        <div className="mainstays-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> good stuff, out in the wild</p>
          <h2>Mainstays<br /><em>in the wild.</em></h2>
          <p>Little jars, big adventures. Tag us in your table spreads, picnic plans, and everything in between.</p>
        </div>
        <div className="mainstays-gallery">
          {galleryImages.map((image, index) => (
            <figure className={`mainstay-photo mainstay-photo-${index + 1}`} key={image.src}>
              <img src={image.src} alt={image.alt} />
              {index === 1 && <span className="mainstay-tag"><Instagram size={13} /> yourmainstays</span>}
              <figcaption>{image.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="word-section" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="word-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> the good word</p>
          <h2>Spread<br /><em>the word.</em></h2>
          <p>(and maybe some chutney)</p>
        </div>
        <div className={`word-carousel ${isChanging ? `is-changing change-${reviewDirection > 0 ? 'right' : 'left'}` : ''}`}>
          {[-1, 0, 1].map((offset) => {
            const review = reviews[(activeReview + offset + reviews.length) % reviews.length];
            const position = offset === -1 ? 'previous' : offset === 0 ? 'active' : 'next';
            return (
              <article className={`word-card word-card-${position} word-card-${review.color}`} key={`${review.name}-${position}`}>
                <div className="word-card-top"><span className="word-stars"><Star size={13} fill="currentColor" /> <Star size={13} fill="currentColor" /> <Star size={13} fill="currentColor" /> <Star size={13} fill="currentColor" /> <Star size={13} fill="currentColor" /></span><span>{review.name}</span></div>
                <blockquote>“{review.quote}”</blockquote>
                {position === 'active' && (
                  <button className="word-product-link" onClick={() => navigate('products')}>view the good stuff <ArrowRight size={15} /></button>
                )}
              </article>
            );
          })}
          <button className="word-arrow word-arrow-left" onClick={() => changeReview(-1)} aria-label="Previous review" disabled={isChanging}><ArrowLeft size={18} /></button>
          <button className="word-arrow word-arrow-right" onClick={() => changeReview(1)} aria-label="Next review" disabled={isChanging}><ArrowRight size={18} /></button>
          {activeProduct && <div className="word-floating-jar" aria-hidden="true"><div className="word-jar-ribbon">made for sharing</div><div className="word-jar-glow" style={{ background: activeProduct.color }} /><Jar product={activeProduct} featured /></div>}
        </div>
      </section>

    </div>
  );
}
