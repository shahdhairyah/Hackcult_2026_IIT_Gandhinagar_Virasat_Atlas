import React from 'react';
import { SearchX, FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No records found", 
  message = "Try adjusting your search terms or active filters.",
  actionLabel,
  onAction
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      backgroundColor: '#fff',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--color-paper-200)',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        margin: '0 auto 1.25rem',
        borderRadius: '50%',
        backgroundColor: 'var(--color-paper-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-stone-600)'
      }}>
        <SearchX size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-ink-950)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={onAction} className="btn btn-secondary btn-sm">
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

