import { useEffect, useState } from 'react';
import { ArrowUp, Sparkle } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 400);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <span className="back-to-top-ring" aria-hidden="true">back · to · top</span>
      <Sparkle className="back-to-top-sparkle back-to-top-sparkle-one" size={11} strokeWidth={1.8} aria-hidden="true" />
      <Sparkle className="back-to-top-sparkle back-to-top-sparkle-two" size={8} strokeWidth={2} aria-hidden="true" />
      <span className="back-to-top-arrow" aria-hidden="true"><ArrowUp size={18} strokeWidth={1.8} /></span>
    </button>
  );
}
