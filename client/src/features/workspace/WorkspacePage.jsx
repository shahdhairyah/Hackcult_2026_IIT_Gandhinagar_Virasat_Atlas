import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { PlusCircle, Edit3, Eye, Send, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function WorkspacePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadMyItems();
  }, []);

  async function loadMyItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/workspace/items');
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load researcher workspace.');
    } finally {
      setLoading(false);
    }
  }

  const handleQuickSubmit = async (item) => {
    try {
      await api.patch(`/archive-items/${item.id}`, {
        ...item,
        status: 'pending_review'
      });
      await loadMyItems();
    } catch (err) {
      alert(err.message || 'Failed to submit item for review.');
    }
  };

  const filteredItems = items.filter(it => {
    if (filterStatus === 'all') return true;
    return it.status === filterStatus;
  });

  const draftCount = items.filter(i => i.status === 'draft').length;
  const pendingCount = items.filter(i => i.status === 'pending_review').length;
  const publishedCount = items.filter(i => i.status === 'published').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)' }}>
            Researcher Workspace
          </h1>
          <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
            Logged in as <strong>{user?.full_name}</strong> ({user?.organization || 'Heritage Researcher'})
          </p>
        </div>

        <Link to="/contribute" className="btn btn-primary">
          <PlusCircle size={16} />
          New Heritage Contribution
        </Link>
      </div>

      {/* Stats Counters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-stone-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)', textTransform: 'uppercase', fontWeight: 600 }}>
            Drafts in Progress
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {draftCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-amber-700)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-amber-700)', textTransform: 'uppercase', fontWeight: 600 }}>
            Under Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-green-700)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-green-700)', textTransform: 'uppercase', fontWeight: 600 }}>
            Published Records
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {publishedCount}
          </div>
        </div>

        {rejectedCount > 0 && (
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-red-700)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-red-700)', textTransform: 'uppercase', fontWeight: 600 }}>
              Needs Correction
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-red-700)', marginTop: '0.25rem' }}>
              {rejectedCount}
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--color-paper-200)',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        {['all', 'draft', 'pending_review', 'published', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '0.65rem 1.15rem',
              fontSize: '0.88rem',
              fontWeight: filterStatus === st ? 600 : 400,
              color: filterStatus === st ? 'var(--color-bronze-600)' : 'var(--color-stone-600)',
              borderBottom: filterStatus === st ? '2px solid var(--color-bronze-600)' : '2px solid transparent',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {st === 'all' ? 'All Records' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-600)' }}>
          Loading your contributions...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadMyItems} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No contributions in this view"
          message="Create your first archive contribution with field notes, photos, and source attribution."
          actionLabel="Create New Record"
          onAction={() => window.location.href = '/contribute'}
        />
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <StatusBadge status={item.status} />
                    <span className="badge badge-type">{item.item_type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)' }}>
                      {item.region} • Updated {new Date(item.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--color-ink-950)' }}>
                    <Link to={`/archive/${item.id}`} style={{ hover: { color: 'var(--color-bronze-600)' } }}>
                      {item.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-stone-600)', marginBottom: '0.85rem' }}>
                    {item.summary}
                  </p>

                  {/* Rejection notice if reviewer asked for corrections */}
                  {item.status === 'rejected' && item.rejection_reason && (
                    <div style={{
                      backgroundColor: '#FFEBEE',
                      border: '1px solid #FFCDD2',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: 'var(--color-red-700)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <AlertTriangle size={16} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                      <div>
                        <strong>Reviewer feedback:</strong> {item.rejection_reason}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {item.tags.map(t => (
                        <span key={t.slug} style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--color-paper-100)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-ink-800)'
                        }}>
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to={`/archive/${item.id}`} className="btn btn-outline btn-sm">
                    <Eye size={14} />
                    View
                  </Link>

                  {/* If draft or rejected, researcher can edit and submit */}
                  {(item.status === 'draft' || item.status === 'rejected') && (
                    <>
                      <Link to={`/contribute/${item.id}`} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} />
                        Edit Draft
                      </Link>

                      <button
                        onClick={() => handleQuickSubmit(item)}
                        className="btn btn-primary btn-sm"
                        title="Submit this draft directly for review"
                      >
                        <Send size={14} />
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
