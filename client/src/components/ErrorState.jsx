import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "Failed to load archive data from the API.",
  onRetry 
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: '#FFF5F5',
      borderRadius: 'var(--radius-md)',
      border: '1px solid #FED7D7',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        margin: '0 auto 1rem',
        borderRadius: '50%',
        backgroundColor: '#FEEBC8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-red-700)'
      }}>
        <AlertTriangle size={26} />
      </div>
      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-red-700)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--color-red-700)', color: 'var(--color-red-700)' }}>
          <RefreshCw size={14} />
          Retry Request
        </button>
      )}
    </div>
  );
}

