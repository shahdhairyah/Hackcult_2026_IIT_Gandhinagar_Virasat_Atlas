import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useTranslation } from '../../utils/i18n';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { 
  PlusCircle, 
  Edit3, 
  Eye, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Bookmark, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export default function WorkspacePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, savedRes] = await Promise.all([
        api.get('/workspace/items'),
        api.get('/saved-items').catch(() => ({ data: [] }))
      ]);
      setItems(itemsRes.data || []);
      setSavedItems(savedRes.data || []);
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
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to submit item for review.');
    }
  };

  const handleRemoveBookmark = async (archiveItemId) => {
    if (!window.confirm('Remove this record from your saved bookmarks?')) return;
    try {
      await api.delete(`/saved-items/${archiveItemId}`);
      setSavedItems(prev => prev.filter(s => s.archive_item_id !== archiveItemId));
    } catch (err) {
      alert(err.message || 'Failed to remove bookmark.');
    }
  };

  const draftCount = items.filter(i => i.status === 'draft').length;
  const pendingCount = items.filter(i => i.status === 'pending_review').length;
  const publishedCount = items.filter(i => i.status === 'published').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;

  const filteredItems = items.filter(it => {
    if (filterStatus === 'all') return true;
    return it.status === filterStatus;
  });

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
            {t('nav_workspace', 'Researcher Workspace')}
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
        <div 
          className="card" 
          onClick={() => setFilterStatus('draft')}
          style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-stone-600)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)', textTransform: 'uppercase', fontWeight: 600 }}>
            Drafts in Progress
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {draftCount}
          </div>
        </div>

        <div 
          className="card" 
          onClick={() => setFilterStatus('pending_review')}
          style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-amber-700)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-amber-700)', textTransform: 'uppercase', fontWeight: 600 }}>
            Under Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div 
          className="card" 
          onClick={() => setFilterStatus('published')}
          style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-green-700)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-green-700)', textTransform: 'uppercase', fontWeight: 600 }}>
            Published Records
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {publishedCount}
          </div>
        </div>

        <div 
          className="card" 
          onClick={() => setFilterStatus('saved')}
          style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-blue-700)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-blue-700)', textTransform: 'uppercase', fontWeight: 600 }}>
            Bookmarked Records
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.25rem' }}>
            {savedItems.length}
          </div>
        </div>

        {rejectedCount > 0 && (
          <div 
            className="card" 
            onClick={() => setFilterStatus('rejected')}
            style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-red-700)', cursor: 'pointer' }}
          >
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
        {[
          { key: 'all', label: 'All Records' },
          { key: 'draft', label: 'Drafts' },
          { key: 'pending_review', label: 'Under Review' },
          { key: 'published', label: 'Published' },
          { key: 'rejected', label: 'Needs Correction' },
          { key: 'saved', label: `⭐ Saved Bookmarks (${savedItems.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '0.65rem 1.15rem',
              fontSize: '0.88rem',
              fontWeight: filterStatus === tab.key ? 600 : 400,
              color: filterStatus === tab.key ? 'var(--color-bronze-600)' : 'var(--color-stone-600)',
              borderBottom: filterStatus === tab.key ? '2px solid var(--color-bronze-600)' : '2px solid transparent',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-600)' }}>
          Loading your contributions and bookmarks...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filterStatus === 'saved' ? (
        /* Render Saved Bookmarks (FR-16) */
        savedItems.length === 0 ? (
          <EmptyState
            title="No Saved Heritage Bookmarks"
            message="You can bookmark archival records from any detail page to keep track of citations, architectural references, and field studies."
            actionLabel="Explore Public Archive"
            onAction={() => window.location.href = '/'}
          />
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {savedItems.map(b => (
              <div key={b.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                    {b.primary_media_key ? (
                      <div style={{
                        width: '100px',
                        height: '80px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: 'var(--color-paper-100)'
                      }}>
                        <img 
                          src={`/api/v1/media/${b.primary_media_id}/view`} 
                          alt={b.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : null}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span className="badge badge-type">{b.item_type || 'heritage'}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)' }}>
                          {b.region} • Saved on {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--color-ink-950)' }}>
                        <Link to={`/archive/${b.archive_item_id}`}>
                          {b.title}
                        </Link>
                      </h3>

                      {b.notes && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-bronze-700)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                          Personal Note: "{b.notes}"
                        </p>
                      )}

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-stone-600)', margin: 0 }}>
                        {b.summary?.slice(0, 140)}...
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link to={`/archive/${b.archive_item_id}`} className="btn btn-outline btn-sm">
                      <Eye size={14} />
                      View
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(b.archive_item_id)}
                      className="btn btn-sm"
                      style={{ color: 'var(--color-red-700)', borderColor: '#FFCDD2', background: '#FFF5F5' }}
                      title="Remove bookmark"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
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
                    <Link to={`/archive/${item.id}`}>
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
