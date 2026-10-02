import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, AtSign, Check, Leaf, Phone, Sparkles } from 'lucide-react';
import type { Page } from '../types';

const FORM_ENDPOINT = 'YOUR_FORM_ENDPOINT';

type FormValues = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { name: '', email: '', message: '' };

export function ContactPage({ navigate }: { navigate: (page: Page) => void }) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'setup'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('idle');
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Please add your name.';
    if (!values.email.trim()) nextErrors.email = 'Please add your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Please check your email address.';
    if (!values.message.trim()) nextErrors.message = 'Please add a message.';
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    if (FORM_ENDPOINT === 'YOUR_FORM_ENDPOINT') {
      setStatus('setup');
      setStatusMessage('Add your form endpoint to enable sending.');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(event.currentTarget), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Unable to send message');
      setStatus('success');
      setValues(initialValues);
    } catch {
      setStatus('error');
      setStatusMessage('We could not send that just now. Please try again.');
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <button className="page-back-link" type="button" onClick={() => navigate('home')}><ArrowLeft size={16} /> back home</button>
        <p className="eyebrow"><span className="eyebrow-line" /> say hello</p>
        <h1>Let's Keep<br /><em>in Touch.</em></h1>
        <p>Have a question, a thought, or just want to say hello?</p>
        <span className="contact-hero-spark" aria-hidden="true"><Sparkles size={30} /></span>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <p className="eyebrow"><span className="eyebrow-line" /> the good line</p>
          <h2>Drop us<br /><em>a note.</em></h2>
          <p>We love hearing what is landing on your table. Send a message and the good stuff crew will get back to you.</p>
          <div className="contact-details"><a href="mailto:hello@goodstuff.co"><AtSign size={17} /> hello@goodstuff.co</a><a href="tel:+201012345678"><Phone size={17} /> +20 10 1234 5678</a></div>
        </div>

        <div className="contact-jar-wrap">
          <div className="contact-jar" aria-label="The Main Stays contact jar">
            <div className="contact-jar-lid"><span>THE MAIN STAYS</span></div>
            <div className="contact-jar-body">
              <div className="contact-jar-label">
                <div className="contact-label-decoration contact-label-decoration-left"><Leaf size={24} /><Leaf size={17} /></div>
                <div className="contact-label-decoration contact-label-decoration-right"><Leaf size={21} /><Sparkles size={15} /></div>
                <span className="contact-label-small">made for more-ish moments</span>
                <strong>The<br />Main<br />Stays</strong>
                <span className="contact-label-name">CONTACT</span>
                {status === 'success' ? (
                  <div className="contact-success"><span><Check size={20} /></span><strong>Message received.</strong><p>Thanks for reaching out. We'll get back to you soon.</p></div>
                ) : (
                  <form className="contact-form" onSubmit={handleSubmit} noValidate>
                    <label><span>name</span><input name="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
                    <label><span>email</span><input name="email" type="email" value={values.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
                    <label><span>message</span><textarea name="message" rows={3} value={values.message} onChange={(event) => updateField('message', event.target.value)} aria-invalid={Boolean(errors.message)} />{errors.message && <small>{errors.message}</small>}</label>
                    <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'sending...' : 'send message'} <ArrowRight size={15} /></button>
                    {(status === 'setup' || status === 'error') && <p className={`contact-status contact-status-${status}`} role="status">{statusMessage}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
