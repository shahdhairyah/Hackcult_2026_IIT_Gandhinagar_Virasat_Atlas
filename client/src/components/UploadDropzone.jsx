import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

export default function UploadDropzone({ onFileSelected, selectedFile, onClear, altText, setAltText, caption, setCaption }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelect = (file) => {
    setError(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported file type (${file.type}). Allowed: JPEG, PNG, WebP, SVG, PDF.`);
      return;
    }

    if (file.size > MAX_BYTES) {
      setError(`File size exceeds 20MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? 'var(--color-bronze-600)' : 'var(--color-paper-200)'}`,
            backgroundColor: dragActive ? 'rgba(138, 90, 50, 0.04)' : '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-paper-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-bronze-600)'
          }}>
            <UploadCloud size={24} />
          </div>

          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-ink-950)', marginBottom: '0.25rem' }}>
            Click to upload or drag &amp; drop master asset
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)' }}>
            High-res photographs (JPEG, PNG, WebP, SVG) or documentary scans (PDF) up to 20MB.
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid var(--color-paper-200)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-paper-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-bronze-600)'
              }}>
                {selectedFile.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-ink-950)' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-600)' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClear}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem 0.6rem' }}
              title="Remove file"
            >
              <X size={15} />
              Remove
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                Alt Text <span style={{ color: 'var(--color-red-700)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Concise visual description for accessibility"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                required
              />
              <div className="form-helper" style={{ fontSize: '0.72rem' }}>
                Screen-reader description. Mandatory for public records.
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                Caption / View Description
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Western tier pavilion looking downwards"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="form-helper" style={{ fontSize: '0.72rem' }}>
                Context note displayed beneath the image.
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-red-700)',
          fontSize: '0.82rem',
          marginTop: '0.5rem'
        }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

