import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  User, 
  FileCheck2, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review modal state
  const [activeItem, setActiveItem] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'approve' | 'reject'
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/review-queue');
      setQueue(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load review queue.');
    } finally {
      setLoading(false);
    }
  }

  const handleReviewSubmit = async () => {
    if (!activeItem || !reviewAction) return;

    if (reviewAction === 'reject' && !rejectReason.trim()) {
      setActionError('A specific correction reason is required when returning a submission.');
      return;
    }

    setProcessing(true);
    setActionError(null);

    try {
      await api.post(`/archive-items/${activeItem.id}/review`, {
        action: reviewAction,
        reason: rejectReason
      });

      // Close modal and refresh
      setActiveItem(null);
      setReviewAction(null);
      setRejectReason('');
      await loadQueue();
    } catch (err) {
      setActionError(err.message || 'Failed to submit review decision.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)' }}>
          Archival Editorial Review Queue
        </h1>
        <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
          Evaluate submitted field records, verify rights/licensing statements, and confirm provenance before public publication.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-600)' }}>
          Loading review queue...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadQueue} />
      ) : queue.length === 0 ? (
        <EmptyState
          title="Review Queue is Empty"
          message="There are currently no records awaiting editorial review. Newly submitted records from researchers will appear here."
        />
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {queue.map(item => (
            <div key={item.id} className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-amber-700)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Left Column: Metadata & Provenance */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                    <StatusBadge status={item.status} />
                    <span className="badge badge-type">{item.item_type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)' }}>
                      Submitted {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-ink-950)', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-800)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {item.summary}
                  </p>

                  <div style={{
                    backgroundColor: 'var(--color-paper-100)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={15} color="var(--color-bronze-600)" />
                      <span><strong>Contributor:</strong> {item.submitter_name} ({item.submitter_email})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={15} color="var(--color-bronze-600)" />
                      <span><strong>Location:</strong> {item.location_name || item.region} {item.latitude && `(${item.latitude}, ${item.longitude})`}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={15} color="var(--color-bronze-600)" />
                      <span><strong>Rights:</strong> {item.rights_status}</span>
                    </div>

                    {item.attribution_text && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        "{item.attribution_text}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Actions & Quick Review */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  border: '1px solid var(--color-paper-200)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ink-950)', marginBottom: '0.75rem' }}>
                      Editorial Quality Checks:
                    </div>
                    <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--color-stone-600)', display: 'grid', gap: '0.4rem' }}>
                      <li>✓ Title and description distinguish fact from conjecture</li>
                      <li>✓ Named location or regional boundary verified</li>
                      <li>✓ Verbatim source and attribution provided</li>
                      <li>✓ Primary master media attached</li>
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <Link to={`/archive/${item.id}`} className="btn btn-outline btn-sm">
                      <Eye size={14} />
                      Inspect Full Record
                    </Link>

                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setReviewAction('reject');
                        setRejectReason('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--color-red-700)', borderColor: '#FFCDD2' }}
                    >
                      <XCircle size={14} />
                      Request Corrections
                    </button>

                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setReviewAction('approve');
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle size={14} />
                      Approve &amp; Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Decision Modal */}
      {activeItem && reviewAction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(23, 25, 27, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-ink-950)' }}>
              {reviewAction === 'approve' ? 'Approve Record for Public Discovery' : 'Return Record for Correction'}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-stone-600)', marginBottom: '1.25rem' }}>
              Record: <strong>{activeItem.title}</strong>
            </p>

            {actionError && (
              <div style={{
                backgroundColor: '#FFEBEE',
                border: '1px solid #FFCDD2',
                color: 'var(--color-red-700)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontSize: '0.85rem'
              }}>
                {actionError}
              </div>
            )}

            {reviewAction === 'approve' ? (
              <div style={{ fontSize: '0.88rem', color: 'var(--color-ink-800)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Approving this record will mark its status as <strong>published</strong>. It will become discoverable in the public catalogue, map exploration, and available for inclusion in curated collections.
              </div>
            ) : (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Correction Reason / Reviewer Feedback <span style={{ color: 'var(--color-red-700)' }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Explain what needs clarification (e.g. precise location coordinates, missing license attribution, or typos in transcription)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveItem(null);
                  setReviewAction(null);
                }}
                disabled={processing}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={processing}
                className={reviewAction === 'approve' ? 'btn btn-primary' : 'btn btn-danger'}
              >
                {processing ? 'Processing...' : (reviewAction === 'approve' ? 'Confirm Approval' : 'Send Feedback')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

