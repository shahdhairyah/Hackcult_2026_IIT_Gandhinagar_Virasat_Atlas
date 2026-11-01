import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../app/AuthContext';
import { FileSearch, CheckCircle2, AlertTriangle, Sparkles, Save, Languages } from 'lucide-react';

export default function TranscriptEditor({ itemId, canEdit = false }) {
  const { user } = useAuth();
  const [ocrJobs, setOcrJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningOcr, setRunningOcr] = useState(false);
  const [selectedLang, setSelectedLang] = useState('eng');
  const [activeJobId, setActiveJobId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadOcrJobs();
  }, [itemId]);

  async function loadOcrJobs() {
    setLoading(true);
    try {
      const res = await api.get(`/archive-items/${itemId}/ocr-jobs`);
      const list = res.data || [];
      setOcrJobs(list);
      if (list.length > 0) {
        setActiveJobId(list[0].id);
        setEditedText(list[0].reviewed_text || list[0].raw_text || '');
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const handleRunOcr = async () => {
    setRunningOcr(true);
    setMessage(null);
    try {
      const res = await api.post(`/archive-items/${itemId}/ocr-jobs`, {
        language: selectedLang
      });
      await loadOcrJobs();
      setMessage({ type: 'success', text: 'OCR extraction completed. Please review and correct below.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'OCR extraction failed.' });
    } finally {
      setRunningOcr(false);
    }
  };

  const handleSaveReviewed = async () => {
    if (!activeJobId) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.patch(`/ocr-jobs/${activeJobId}`, {
        reviewed_text: editedText
      });
      await loadOcrJobs();
      setMessage({ type: 'success', text: 'Human-reviewed transcript saved! It is now indexed for keyword search.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save reviewed transcript.' });
    } finally {
      setSaving(false);
    }
  };

  const currentJob = ocrJobs.find(j => j.id === activeJobId) || ocrJobs[0];

  return (
    <div className="card" style={{ padding: '2rem', marginTop: '2rem', borderTop: '4px solid var(--color-blue-700)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--color-paper-200)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSearch size={20} color="var(--color-blue-700)" />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ink-950)' }}>
            OCR &amp; Paleographic Transcription Assistant
          </h3>
        </div>

        {/* OCR Action Trigger for allowed researchers */}
        {canEdit && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              className="form-control"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
            >
              <option value="eng">English (Latin)</option>
              <option value="san">Sanskrit (Devanagari)</option>
              <option value="guj">Gujarati (Vernacular)</option>
            </select>

            <button
              onClick={handleRunOcr}
              disabled={runningOcr}
              className="btn btn-secondary btn-sm"
              title="Run OCR transcription engine on primary asset"
            >
              <Sparkles size={14} color="var(--color-blue-700)" />
              {runningOcr ? 'Analyzing Script...' : 'Extract OCR Text'}
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--color-stone-600)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        As mandated by archival preservation standards, <strong>machine-extracted text is unverified draft data</strong>. Transcriptions must be manually compared with the source document and verified by a researcher before inclusion in search indexes.
      </p>

      {message && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
          color: message.type === 'success' ? 'var(--color-green-700)' : 'var(--color-red-700)',
          border: `1px solid ${message.type === 'success' ? '#C8E6C9' : '#FFCDD2'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-stone-600)' }}>
          Loading transcription records...
        </div>
      ) : ocrJobs.length === 0 ? (
        <div style={{
          padding: '2.5rem 1.5rem',
          backgroundColor: 'var(--color-paper-50)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          color: 'var(--color-stone-600)',
          border: '1px dashed var(--color-paper-200)'
        }}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            No OCR transcriptions have been generated for this archive item yet.
          </p>
          {canEdit && (
            <button onClick={handleRunOcr} className="btn btn-primary btn-sm">
              <Sparkles size={14} /> Run OCR Assistant Now
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Side-by-side Raw vs Reviewed View */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Raw Machine Extraction */}
            <div style={{
              backgroundColor: 'var(--color-paper-50)',
              border: '1px solid var(--color-paper-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                  Raw Machine Extraction (Draft / Unreviewed)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-stone-600)' }}>
                  Lang: {currentJob?.language} • Confidence: {(currentJob?.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <pre style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-paper-200)',
                whiteSpace: 'pre-wrap',
                minHeight: '140px',
                color: 'var(--color-ink-950)'
              }}>
                {currentJob?.raw_text || 'No raw text available.'}
              </pre>
            </div>

            {/* Human Reviewed Transcript */}
            <div style={{
              backgroundColor: '#fff',
              border: `1px solid ${currentJob?.status === 'reviewed' ? '#C8E6C9' : 'var(--color-paper-200)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span className={currentJob?.status === 'reviewed' ? 'badge badge-published' : 'badge badge-draft'} style={{ fontSize: '0.72rem' }}>
                  {currentJob?.status === 'reviewed' ? 'Human-Reviewed Transcript (Indexed)' : 'Review Pending'}
                </span>
                {currentJob?.reviewer_name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-green-700)', fontWeight: 500 }}>
                    Verified by {currentJob.reviewer_name}
                  </span>
                )}
              </div>

              {canEdit ? (
                <div>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    placeholder="Compare with the master image and enter verified transcription..."
                    style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                    <button
                      onClick={handleSaveReviewed}
                      disabled={saving}
                      className="btn btn-primary btn-sm"
                    >
                      <Save size={14} />
                      {saving ? 'Saving...' : 'Save Human-Reviewed Transcript'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-paper-50)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  minHeight: '140px',
                  color: 'var(--color-ink-950)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {currentJob?.reviewed_text || (
                    <span style={{ color: 'var(--color-stone-600)', fontStyle: 'italic' }}>
                      This text has not yet undergone editorial paleographic verification.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

