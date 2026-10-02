import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { storeLocations } from '../lib/storeLocations';
import type { Page } from '../types';

export function StoresPage({ navigate }: { navigate: (page: Page, params?: Record<string, string>) => void }) {
  return (
    <main className="stores-directory">
      <div className="stores-directory-heading">
        <p className="eyebrow"><span className="eyebrow-line" /> stock up nearby</p>
        <div>
          <h1>Find your<br /><em>nearest jar.</em></h1>
        </div>
        <div className="stores-directory-subtitle-wrap">
          <p className="stores-directory-subtitle">Good things are closer than you think.</p>
          <span className="stores-directory-note">Demo locations · easy to update</span>
        </div>
      </div>

      <div className="stores-grid">
        {storeLocations.map((location) => (
          <article className="store-card" key={location.id}>
            <MapPin className="store-card-icon" size={21} />
            <span className="store-card-city">{location.city}</span>
            <h2>{location.name}</h2>
            <p className="store-card-address">{location.address}</p>
            <a className="store-card-phone" href={`tel:${location.phone.replace(/\s/g, '')}`}><Phone size={14} /> {location.phone}</a>
            <div className="store-card-footer">
              <span>{location.hours}</span>
              <a href={location.locationUrl} target="_blank" rel="noreferrer">
                view location <ArrowRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>

      <button className="stores-back-link" type="button" onClick={() => navigate('home')}>
        <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> back to the good stuff
      </button>
    </main>
  );
}
