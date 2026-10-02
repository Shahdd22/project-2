import { useState } from 'react';
import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { ProductCarousel } from '../components/ProductCarousel';
import { EditorialHomeSections } from '../components/EditorialHomeSections';
import { storeLocations } from '../lib/storeLocations';
import type { Product, Page } from '../types';

export function HomePage({
  products,
  navigate,
}: {
  products: Product[];
  navigate: (page: Page, params?: Record<string, string>) => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState(storeLocations[0]);

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-image" role="img" aria-label="A table full of colorful food and jars" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light"><span className="eyebrow-line" /> pantry essentials with a plot twist</p>
          <h1>Your pantry's<br /><em>new</em> main<br />character.</h1>
          <p className="hero-copy">Sauces, spreads and little sparks of joy for making everyday meals feel like a big deal.</p>
          <a className="pill-button light-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
            Meet the good stuff <ArrowRight size={17} />
          </a>
        </div>
        <div className="hero-stamp">100%<br /><small>good<br />energy</small></div>
        <div className="scroll-note"><ArrowDown size={16} /> scroll to snack</div>
      </section>

      <div className="marquee marquee-red" aria-hidden="true">
        <div>JAM-PACKED WITH FLAVOUR <span>✦</span> THOUGHTFULLY SOURCED <span>✦</span> BOLD MODERN CLASSICS <span>✦</span> FLAVOURS THAT PLAY WELL WITH OTHERS <span>✦</span></div>
        <div>JAM-PACKED WITH FLAVOUR <span>✦</span> THOUGHTFULLY SOURCED <span>✦</span> BOLD MODERN CLASSICS <span>✦</span> FLAVOURS THAT PLAY WELL WITH OTHERS <span>✦</span></div>
      </div>

      <section className="product-showcase section-cream">
        <div className="section-intro">
          <p className="eyebrow"><span className="eyebrow-line" /> choose your jar</p>
          <h2>Good stuff,<br /><em>no filler.</em></h2>
          <p>Big flavour. Tiny ingredient list. Every jar is made to make your favourite meals taste even more like you know what you're doing.</p>
          <a className="text-link" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
            shop all pantry magic <ArrowRight size={16} />
          </a>
        </div>
        <ProductCarousel products={products} navigate={navigate} />
      </section>

      <EditorialHomeSections products={products} navigate={navigate} />

      <section className="story-section" id="story">
        <div className="story-photo photo-one" role="img" aria-label="Colorful sauces on a table" />
        <div className="story-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> the good stuff philosophy</p>
          <h2>Make room for<br /><em>more yes.</em></h2>
          <p>We believe the best meals are the ones that don't take themselves too seriously. So we make small-batch pantry staples with big, unexpected flavour — for the weeknight wins, the last-minute guests, and the "just one more bite" moments.</p>
          <a className="pill-button red-button" onClick={() => navigate('story')} style={{ cursor: 'pointer' }}>
            read our story <ArrowRight size={17} />
          </a>
        </div>
        <div className="story-photo photo-two" role="img" aria-label="Homemade jam jars on a wooden table" />
        <div className="scribble">made<br />with<br /><span>♥</span></div>
      </section>

      <section className="recipe-section section-cream" id="recipes">
        <div className="recipe-heading">
          <p className="eyebrow" style={{ justifyContent: 'center', color: 'var(--red)' }}><span className="eyebrow-line" /> from the good side</p>
          <h2>Meals that make<br />you look <em>good.</em></h2>
          <a className="pill-button red-button" onClick={() => navigate('recipes')} style={{ cursor: 'pointer', marginTop: '8px' }}>all recipes <ArrowRight size={17} /></a>
        </div>
        <div className="recipe-grid">
          <a className="recipe-card recipe-card-large" onClick={() => navigate('recipes')} style={{ cursor: 'pointer' }}>
            <div className="recipe-image recipe-image-sandwich" />
            <span className="recipe-tag">gooey grilled cheese</span>
            <h3>Dip it.<br />Dunk it.<br />Devour it.</h3>
            <ArrowRight className="recipe-arrow" size={24} />
          </a>
          <a className="recipe-card recipe-card-small" onClick={() => navigate('recipes')} style={{ cursor: 'pointer' }}>
            <div className="recipe-image recipe-image-jars" />
            <span className="recipe-tag">three ways with chutney</span>
            <h3>Spread<br />the joy.</h3>
            <ArrowRight className="recipe-arrow" size={24} />
          </a>
          <a className="recipe-card recipe-card-medium" onClick={() => navigate('recipes')} style={{ cursor: 'pointer' }}>
            <div className="recipe-image recipe-image-dip" />
            <span className="recipe-tag">the easy dip</span>
            <h3>Snack time<br />got better.</h3>
            <ArrowRight className="recipe-arrow" size={24} />
          </a>
        </div>
      </section>

      <section className="partner-marquee location-partner-marquee" aria-label="Retail partners">
        <div className="partner-track">
          {['Metro Market', 'Seoudi', 'Gourmet', 'Oscar', 'Fresh Food Market', 'Hyper One', 'Metro Market', 'Seoudi', 'Gourmet', 'Oscar', 'Fresh Food Market', 'Hyper One'].map((partner, index) => (
            <span className="partner-logo" key={`${partner}-${index}`}>{partner}</span>
          ))}
        </div>
      </section>

      <section className="find-section" id="find-us">
        <div className="find-copy">
          <p className="eyebrow light"><span className="eyebrow-line" /> come say hi</p>
          <h2>Find the Mainstays<br /><em>near you.</em></h2>
          <p>Discover your next favourite jar in-store today.</p>
          <a className="pill-button light-button" href="stores.html">
            find a store <MapPin size={16} />
          </a>
        </div>
        <div className="map-art">
          <div className="map-shape">
            <span className="map-label">EGYPT</span>
            {storeLocations.map((location, index) => (
              <button
                className={`pin pin-${index + 1} ${selectedLocation.id === location.id ? 'is-selected' : ''}`}
                key={location.id}
                style={{ left: location.mapPosition.left, top: location.mapPosition.top }}
                onClick={() => setSelectedLocation(location)}
                aria-label={`Show ${location.name}`}
                title={location.name}
              >
                <MapPin size={21} fill="currentColor" />
              </button>
            ))}
          </div>
          <div className="map-location-card" aria-live="polite">
            <span>{selectedLocation.city}</span>
            <strong>{selectedLocation.name}</strong>
            <p>{selectedLocation.hours}</p>
          </div>
        </div>
      </section>

    </>
  );
}
