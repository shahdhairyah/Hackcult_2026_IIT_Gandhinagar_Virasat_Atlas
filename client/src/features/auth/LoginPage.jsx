import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { Lock, Mail, ArrowRight, Shield, UserCheck, AlertCircle } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Researcher', email: 'researcher@virasat.org', label: 'Aarav Patel (Researcher)' },
  { role: 'Reviewer', email: 'reviewer@virasat.org', label: 'Prof. Rajesh Verma (Reviewer)' },
  { role: 'Admin', email: 'admin@virasat.org', label: 'Dr. Sunita Sen (Admin)' },
  { role: 'Visitor', email: 'visitor@virasat.org', label: 'Neha Sharma (Visitor)' }
];

export default function LoginPage() {
  const [email, setEmail] = useState('researcher@virasat.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/workspace';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'reviewer') {
        navigate('/review-queue');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '3.5rem auto',
      padding: '0 1.5rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid var(--color-paper-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--color-bronze-600)',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            fontFamily: 'var(--font-serif)',
            marginBottom: '0.85rem'
          }}>
            V
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-ink-950)' }}>
            Sign In to Archive
          </h2>
          <p style={{ color: 'var(--color-stone-600)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Access researcher workspaces, contribution forms, and editorial review.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            color: 'var(--color-red-700)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-stone-400)'
              }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-stone-400)'
              }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Account Quick Switcher */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-paper-200)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-stone-600)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <UserCheck size={14} color="var(--color-bronze-600)" />
            Quick Demo Accounts (Pre-seeded)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc.email)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${email === acc.email ? 'var(--color-bronze-600)' : 'var(--color-paper-200)'}`,
                  backgroundColor: email === acc.email ? 'rgba(138, 90, 50, 0.08)' : 'var(--color-paper-50)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink-950)' }}>
                  {acc.role}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-stone-600)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {acc.email.split('@')[0]}
                </div>
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-stone-400)', marginTop: '0.6rem', textAlign: 'center' }}>
            Password for all seeded accounts is: <code>password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
