import React from 'react';
import { ShieldCheck, BookOpen, MapPin, Feather } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-ink-950)',
      color: 'var(--color-paper-100)',
      borderTop: '1px solid var(--color-ink-800)',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--color-ink-800)'
        }}>
          <div>
            <h4 style={{ color: 'var(--color-paper-50)', marginBottom: '0.85rem' }}>
              VIRASAT ATLAS
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-stone-400)', lineHeight: 1.6 }}>
              A map-first digital archive revitalising unstructured cultural and architectural heritage records. Preserving provenance, attribution, and location context for enduring historical inquiry.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-paper-50)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--color-sand-300)" />
              Preservation &amp; Rights
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--color-stone-400)', lineHeight: 1.8 }}>
              <li>• Rigorous provenance tracking &amp; attribution statements</li>
              <li>• Creative Commons &amp; Public Domain license compliance</li>
              <li>• Human editorial review of transcription and metadata</li>
              <li>• Secure non-public master asset preservation</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-paper-50)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Feather size={16} color="var(--color-sand-300)" />
              Event Context
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-stone-400)', lineHeight: 1.6 }}>
              Developed for <strong>Challenge HC26-CULT01</strong> at <strong>Blithchron '27, IIT Gandhinagar</strong>. Built using React + PHP REST API + MySQL.
            </p>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-stone-400)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Virasat Atlas Initiative. Cleared heritage research material under respective CC / Public Domain rights.
          </div>
          <div>
            Archival Standard: ISO 14721 (OAIS Conceptual Framework)
          </div>
        </div>
      </div>
    </footer>
  );
}

