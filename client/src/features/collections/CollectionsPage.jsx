import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ErrorState from '../../components/ErrorState';
import { Layers, User, ArrowRight, BookOpen, Compass } from 'lucide-react';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/collections');
      const list = res.data || [];
      setCollections(list);
      if (list.length > 0) {
        setSelectedId(list[0].id);
        loadDetail(list[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load curated collections.');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    setDetailLoading(true);
    try {
      const res = await api.get(`/collections/${id}`);
      setSelectedDetail(res.data);
    } catch (err) {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  }

  const handleSelect = (id) => {
    setSelectedId(id);
    loadDetail(id);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)' }}>
          Curated Heritage Collections &amp; Trails
        </h1>
        <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
          Explore ordered thematic sequences, subterranean water architecture routes, and architectural surveys curated by archival researchers.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone-600)' }}>
          Loading curated collections...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCollections} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Collections List */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-stone-600)',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-paper-200)',
              paddingBottom: '0.5rem'
            }}>
              Thematic Collections
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {collections.map(col => {
                const isSelected = selectedId === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => handleSelect(col.id)}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '4px solid var(--color-bronze-600)' : '4px solid transparent',
                      backgroundColor: isSelected ? 'rgba(138, 90, 50, 0.04)' : '#fff',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-bronze-600)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem'
                    }}>
                      <Layers size={13} />
                      Curated Trail • {col.item_count} Items
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: 'var(--color-ink-950)', marginBottom: '0.5rem' }}>
                      {col.title}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-stone-600)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {col.summary}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <User size={13} />
                      <span>Curated by {col.curator_name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ordered Trail Items */}
          <div>
            {detailLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-stone-600)' }}>
                Loading collection items...
              </div>
            ) : selectedDetail ? (
              <div>
                <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', backgroundColor: '#fff' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-bronze-600)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                  }}>
                    Collection Overview
                  </div>

                  <h2 style={{ fontSize: '1.45rem', color: 'var(--color-ink-950)', marginBottom: '0.75rem' }}>
                    {selectedDetail.title}
                  </h2>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-stone-600)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {selectedDetail.description || selectedDetail.summary}
                  </p>

                  <div style={{
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--color-paper-200)',
                    fontSize: '0.8rem',
                    color: 'var(--color-stone-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <BookOpen size={15} color="var(--color-bronze-600)" />
                    <span>Curated by <strong>{selectedDetail.curator_name}</strong> for educational and research dissemination.</span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <h3 style={{
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-stone-600)',
                  marginBottom: '1rem'
                }}>
                  Ordered Archival Records ({selectedDetail.items?.length || 0})
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedDetail.items?.map((item, idx) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-paper-100)',
                        border: '2px solid var(--color-sand-300)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: 'var(--color-bronze-600)',
                        flexShrink: 0
                      }}>
                        {item.item_order || (idx + 1)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-bronze-600)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {item.item_type} • {item.region}
                        </div>

                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-ink-950)', marginBottom: '0.25rem' }}>
                          <Link to={`/archive/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.title}
                          </Link>
                        </h4>

                        <p style={{ fontSize: '0.82rem', color: 'var(--color-stone-600)', lineHeight: 1.4 }}>
                          {item.curator_notes || item.summary}
                        </p>
                      </div>

                      <Link
                        to={`/archive/${item.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="View Archive Record"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
