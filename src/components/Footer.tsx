import { Instagram } from 'lucide-react';
import type { Page } from '../types';

export function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer-brand">
        <span>the</span>
        <strong>good<br />stuff</strong>
        <p>Pantry heroes for everyday cravings.</p>
      </div>
      <div className="footer-links">
        <div>
          <p>Explore</p>
          <a style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Home</a>
          <a style={{ cursor: 'pointer' }} onClick={() => navigate('products')}>Shop</a>
          <a style={{ cursor: 'pointer' }} onClick={() => navigate('story')}>Our story</a>
          <a style={{ cursor: 'pointer' }} onClick={() => navigate('contact')}>Contact</a>
        </div>
        <div>
          <p>Say hello</p>
          <a href="mailto:hello@goodstuff.co">hello@goodstuff.co</a>
          <a href="#instagram"><Instagram size={17} /> Instagram</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 The Good Stuff Co.</span>
        <span>Made for more-ish moments.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
