import { ArrowRight, Sparkles } from 'lucide-react';
import type { Page } from '../types';

export function StoryPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <div className="page-story">
      <section className="page-hero-strip">
        <p className="eyebrow" style={{ color: 'var(--red)' }}><span className="eyebrow-line" /> our story</p>
        <h1>How the<br /><em>good stuff</em><br />began.</h1>
        <p>It started with a jar, a kitchen, and a very opinionated grandmother.</p>
      </section>

      <section className="story-detail-section">
        <div className="story-photo photo-one story-detail-photo" />
        <div className="story-detail-copy">
          <h2>2019 —<br />The first jar.</h2>
          <p>Our founder, cooking in a tiny apartment kitchen, made a chutney so good her friends wouldn't leave without a jar. The next week, she made twelve. The week after that, a farmers' market stall. The rest is pantry history.</p>
        </div>
      </section>

      <section className="story-detail-section reverse">
        <div className="story-detail-copy">
          <h2>Small batch,<br />big standards.</h2>
          <p>Every jar is made in batches small enough to taste, adjust, and taste again. We source from growers we know, use ingredients we can pronounce, and never, ever cut corners on flavour. If it's not good enough for our table, it's not good enough for yours.</p>
        </div>
        <div className="story-photo photo-two story-detail-photo" />
      </section>

      <section className="story-values">
        <div className="value-card">
          <Sparkles size={32} />
          <h3>Bold by nature</h3>
          <p>Flavours that aren't afraid to show up. We make pantry staples with personality.</p>
        </div>
        <div className="value-card">
          <h3>Honestly made</h3>
          <p>No fillers, no nonsense. Just real ingredients, sourced from people we trust.</p>
        </div>
        <div className="value-card">
          <h3>For everyone</h3>
          <p>Most of our range is vegan and gluten-free. Good food should be shared, not gatekept.</p>
        </div>
      </section>

      <section className="story-cta">
        <h2>Ready for<br /><em>the good stuff?</em></h2>
        <a className="pill-button red-button" onClick={() => navigate('products')} style={{ cursor: 'pointer' }}>
          shop now <ArrowRight size={17} />
        </a>
      </section>
    </div>
  );
}
