import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useTranslation } from '../../utils/i18n';
import StatusBadge from '../../components/StatusBadge';
import TranscriptEditor from '../../components/TranscriptEditor';
import DigitalTwin3DViewer from '../../components/DigitalTwin3DViewer';
import ErrorState from '../../components/ErrorState';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  User, 
  FileText, 
  ExternalLink, 
  Clock, 
  Tag, 
  Building, 
  Info,
  CheckCircle2,
  Bookmark,
  Box,
  Image as ImageIcon
} from 'lucide-react';

export default function ArchiveDetailPage() {
  const { id } = useParams();
  const { user, hasRole, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [mediaTab, setMediaTab] = useState('photo'); // 'photo' | '3d'
  const [savingBookmark, setSavingBookmark] = useState(false);

  useEffect(() => {
    fetchItem();
    fetchRelated();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/saved-items')
        .then(res => {
          const match = (res.data || []).some(s => String(s.archive_item_id) === String(id));
          setIsSaved(match);
        })
        .catch(() => {});
    } else {
      setIsSaved(false);
    }
  }, [id, isAuthenticated]);

  async function fetchRelated() {
    try {
      const res = await api.get(`/archive-items/${id}/related`);
      setRelatedItems(res.data || []);
    } catch (err) {
      // ignore
    }
  }

  async function fetchItem() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/archive-items/${id}`);
      setItem(res.data);
    } catch (err) {
      setError(err.message || 'Archive record not found or access restricted.');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save records to your researcher workspace.');
      return;
    }
    setSavingBookmark(true);
    try {
      if (isSaved) {
        await api.delete(`/saved-items/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/saved-items/${id}`, { notes: `Referenced for ${item?.title}` });
        setIsSaved(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update saved item.');
    } finally {
      setSavingBookmark(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--color-stone-600)' }}>
        Loading heritage archive record #{id}...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '3rem 0' }}>
        <ErrorState
          title="Archive Record Unavailable"
          message={error || "This record might be in draft review or requires researcher access."}
          onRetry={fetchItem}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to Public Explore
          </Link>
        </div>
      </div>
    );
  }

  const primaryMedia = item.media?.find(m => m.is_primary) || item.media?.[0];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-stone-600)' }}>
        <Link to="/" style={{ color: 'var(--color-bronze-600)' }}>Archive</Link>
        <span>/</span>
        <Link to={`/?type=${item.item_type}`} style={{ color: 'var(--color-bronze-600)', textTransform: 'capitalize' }}>{item.item_type}</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-stone-600)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
          {item.title}
        </span>
      </div>

      {/* Title & Actions Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <StatusBadge status={item.status} />
            <span className="badge badge-type">{item.item_type}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--color-stone-600)' }}>
              <MapPin size={14} color="var(--color-bronze-600)" />
              {item.location_name || item.region}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-ink-950)', lineHeight: 1.25 }}>
            {item.title}
          </h1>
        </div>

        {/* Action Buttons: Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleToggleBookmark}
            disabled={savingBookmark}
            className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-outline'}`}
            title={isSaved ? 'Remove from saved items' : 'Bookmark this record'}
          >
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? t('bookmarked', 'Bookmarked') : t('bookmark_record', 'Bookmark Record')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Media & Observation + Metadata Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Media Viewer & Narrative */}
        <div>
          {/* Media View Selector Tabs (FR-18) */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.85rem',
            borderBottom: '1px solid var(--color-paper-200)',
            paddingBottom: '0.35rem'
          }}>
            <button
              onClick={() => setMediaTab('photo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: mediaTab === 'photo' ? 600 : 400,
                color: mediaTab === 'photo' ? 'var(--color-bronze-600)' : 'var(--color-stone-600)',
                background: mediaTab === 'photo' ? 'var(--color-paper-100)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <ImageIcon size={14} />
              Master Photographic Media
            </button>

            <button
              onClick={() => setMediaTab('3d')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: mediaTab === '3d' ? 600 : 400,
                color: mediaTab === '3d' ? 'var(--color-bronze-600)' : 'var(--color-stone-600)',
                background: mediaTab === '3d' ? 'var(--color-paper-100)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <Box size={14} />
              {t('view_3d_twin', 'Interactive 3D Digital Twin')}
            </button>
          </div>

          {/* Master Media Display OR 3D Digital Twin Viewer */}
          {mediaTab === '3d' ? (
            <div style={{ marginBottom: '2rem' }}>
              <DigitalTwin3DViewer monumentTitle={item.title} />
            </div>
          ) : primaryMedia ? (
            <div className="card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{
                maxHeight: '480px',
                backgroundColor: 'var(--color-ink-950)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={`/api/v1/media/${primaryMedia.id}/view`}
                  alt={primaryMedia.alt_text || item.title}
                  style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }}
                />
              </div>

              {(primaryMedia.caption || primaryMedia.alt_text) && (
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--color-paper-50)',
                  borderTop: '1px solid var(--color-paper-200)',
                  fontSize: '0.85rem',
                  color: 'var(--color-stone-600)'
                }}>
                  {primaryMedia.caption && (
                    <div style={{ fontWeight: 500, color: 'var(--color-ink-800)', marginBottom: '0.2rem' }}>
                      {primaryMedia.caption}
                    </div>
                  )}
                  {primaryMedia.alt_text && (
                    <div style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                      Alt: {primaryMedia.alt_text}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: '3rem',
              backgroundColor: 'var(--color-paper-100)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              color: 'var(--color-stone-600)',
              marginBottom: '2rem'
            }}>
              No master media file attached to this record.
            </div>
          )}

          {/* Record Narrative */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-ink-950)' }}>
              Summary &amp; Cultural Context
            </h3>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--color-ink-950)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              {item.summary}
            </p>

            {item.description && (
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.65rem', color: 'var(--color-ink-800)' }}>
                  Architectural &amp; Epigraphic Observations
                </h4>
                <div style={{
                  fontSize: '0.92rem',
                  color: 'var(--color-stone-600)',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line'
                }}>
                  {item.description}
                </div>
              </div>
            )}

            {/* Curatorial Tags */}
            {item.tags && item.tags.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-paper-200)' }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-stone-600)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Tag size={13} color="var(--color-bronze-600)" />
                  Thematic Tags
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {item.tags.map(t => (
                    <Link
                      key={t.slug}
                      to={`/?tag=${t.slug}`}
                      style={{
                        fontSize: '0.8rem',
                        backgroundColor: 'var(--color-paper-100)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-ink-950)',
                        textDecoration: 'none'
                      }}
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* OCR & Paleographic Transcription Assistant */}
          <TranscriptEditor 
            itemId={parseInt(id, 10)} 
            canEdit={hasRole('researcher')} 
          />
        </div>

        {/* Right Column: Metadata & Provenance Sidebar */}
        <div>
          {/* Spatial & Temporal Context */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-stone-600)',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--color-paper-200)',
              paddingBottom: '0.5rem'
            }}>
              Spatial &amp; Historical Context
            </h3>

            <dl style={{ display: 'grid', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Named Location</dt>
                <dd style={{ fontWeight: 600, color: 'var(--color-ink-950)' }}>
                  {item.location_name || item.region}
                </dd>
              </div>

              <div>
                <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Region / State</dt>
                <dd style={{ color: 'var(--color-ink-950)' }}>
                  {item.region}{item.location_state ? `, ${item.location_state}` : ''}, {item.location_country || 'India'}
                </dd>
              </div>

              {item.latitude && item.longitude && (
                <div>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Geographic Coordinates</dt>
                  <dd style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-blue-700)' }}>
                    {parseFloat(item.latitude).toFixed(5)}° N, {parseFloat(item.longitude).toFixed(5)}° E
                  </dd>
                </div>
              )}

              {item.historical_period && (
                <div>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Historical Period</dt>
                  <dd style={{ color: 'var(--color-ink-950)', fontWeight: 500 }}>
                    {item.historical_period}
                  </dd>
                </div>
              )}

              {item.capture_date && (
                <div>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Documentation Date</dt>
                  <dd style={{ color: 'var(--color-ink-950)' }}>
                    {new Date(item.capture_date).toLocaleDateString()}
                  </dd>
                </div>
              )}

              {item.language && (
                <div>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Source Language</dt>
                  <dd style={{ color: 'var(--color-ink-950)' }}>
                    {item.language}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Provenance & Rights Box */}
          <div className="card" style={{
            padding: '1.75rem',
            backgroundColor: '#FCFAF7',
            border: '1px solid var(--color-sand-300)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-bronze-600)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderBottom: '1px solid var(--color-paper-200)',
              paddingBottom: '0.5rem'
            }}>
              <ShieldCheck size={16} />
              Provenance &amp; Attribution
            </h3>

            <dl style={{ display: 'grid', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Originating Source</dt>
                <dd style={{ fontWeight: 600, color: 'var(--color-ink-950)' }}>
                  {item.source}
                </dd>
              </div>

              {item.creator && (
                <div>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Investigator / Creator</dt>
                  <dd style={{ color: 'var(--color-ink-950)' }}>
                    {item.creator}
                  </dd>
                </div>
              )}

              <div>
                <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rights &amp; Permission Status</dt>
                <dd style={{ marginTop: '0.2rem' }}>
                  <span className="badge badge-published" style={{ textTransform: 'none', fontSize: '0.8rem' }}>
                    {item.rights_status.toUpperCase().replace(/_/g, '-')}
                  </span>
                </dd>
              </div>

              {item.attribution_text && (
                <div style={{ marginTop: '0.25rem' }}>
                  <dt style={{ color: 'var(--color-stone-600)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Attribution Statement</dt>
                  <dd style={{
                    marginTop: '0.25rem',
                    padding: '0.65rem',
                    backgroundColor: '#fff',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-paper-200)',
                    fontSize: '0.82rem',
                    color: 'var(--color-ink-950)',
                    fontStyle: 'italic'
                  }}>
                    {item.attribution_text}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Editorial Audit Note */}
          <div className="card" style={{ padding: '1.25rem', fontSize: '0.82rem', color: 'var(--color-stone-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-ink-800)', fontWeight: 600, marginBottom: '0.4rem' }}>
              <CheckCircle2 size={15} color="var(--color-green-700)" />
              Editorial Review Status
            </div>
            <div>Submitted by: <strong>{item.submitter_name}</strong></div>
            {item.reviewer_name && (
              <div>Reviewed &amp; Approved by: <strong>{item.reviewer_name}</strong></div>
            )}
            {item.reviewed_at && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', marginTop: '0.2rem' }}>
                Archival approval logged on {new Date(item.reviewed_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Heritage Records */}
      {relatedItems.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--color-paper-200)' }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: 'var(--color-ink-950)',
            marginBottom: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {t('related_records', 'Related Heritage Records')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-stone-600)', marginBottom: '1.5rem' }}>
            Recommended archives sharing regional water hydrology, Solanki stone carving styles, or thematic tags.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {relatedItems.map(rel => (
              <Link
                key={rel.id}
                to={`/archive/${rel.id}`}
                className="card"
                style={{
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  height: '130px',
                  backgroundColor: 'var(--color-paper-100)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: '0.75rem'
                }}>
                  {rel.primary_media_key ? (
                    <img
                      src={`/api/v1/media/${rel.primary_media_id}/view`}
                      alt={rel.primary_media_alt || rel.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-stone-600)',
                      fontSize: '0.8rem'
                    }}>
                      Archive #{rel.id}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--color-bronze-600)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {rel.item_type} • {rel.region}
                </div>

                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-ink-950)', margin: '0.25rem 0 0.5rem', lineHeight: 1.3 }}>
                  {rel.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-stone-600)', lineHeight: 1.4, flex: 1 }}>
                  {rel.summary?.length > 90 ? rel.summary.slice(0, 90) + '...' : rel.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
