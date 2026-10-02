import type { Product } from '../types';

export function Jar({ product, featured = false, size = 'md' }: { product: Product; featured?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`jar-wrap ${featured ? 'jar-featured' : ''} jar-${size}`}>
      <div className="jar-shadow" />
      <div className="jar">
        <div className="jar-lid"><span>THE GOOD</span></div>
        <div
          className="jar-glass"
          style={{
            background: `linear-gradient(108deg, rgba(255,255,255,.2) 0%, transparent 16%, transparent 76%, rgba(38,22,14,.24) 100%), linear-gradient(90deg, ${product.color}, ${product.accent} 48%, ${product.color})`,
          }}
        />
        <div className="jar-label" style={{ backgroundColor: product.color }}>
          <span className="label-small">made for</span>
          <strong>good<br />stuff</strong>
          <span className="label-name">{product.name}</span>
          <span className="label-volume">{product.size} · pantry classic</span>
        </div>
        <div className="jar-shine" />
      </div>
    </div>
  );
}
