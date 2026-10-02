import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import type { Page } from '../types';

export function LoginPage({ navigate }: { navigate: (page: Page) => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('home');
    }
  };

  return (
    <div className="page-login">
      <div className="login-card">
        <div className="login-brand">
          <span>the</span>
          <strong>good<br />stuff</strong>
        </div>

        <div className="login-tabs">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign in</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="pill-button red-button login-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <p className="login-foot">
          {mode === 'signin' ? "New here? " : "Already have an account? "}
          <a onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
          </a>
        </p>
      </div>
    </div>
  );
}
