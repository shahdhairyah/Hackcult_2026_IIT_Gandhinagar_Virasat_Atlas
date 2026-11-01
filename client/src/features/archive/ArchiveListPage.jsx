import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { Search, Filter, MapPin, Calendar, ShieldCheck, ArrowRight, X } from 'lucide-react';

const TYPES = [
  { value: '', label: 'All Heritage Types' },
  { value: 'monument', label: 'Monuments' },
  { value: 'architecture', label: 'Architecture / Vavs' },
  { value: 'craft', label: 'Living Crafts' },
  { value: 'document', label: 'Documents & Epigraphy' },
  { value: 'field_note', label: 'Field Notes' }
];

export default function ArchiveListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 12, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters from URL query params
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const region = searchParams.get('region') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    fetchItems();
  }, [q, type, region, sort, page]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/archive-items', {
        q,
        type,
        region,
        sort,
        page,
        per_page: 12
      });
      setItems(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      setError(err.message || 'Failed to load catalogue records.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('q', searchInput.trim());
    } else {
      next.delete('q');
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const updateFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = q || type || region || (sort && sort !== 'latest');

  return (
    <div>
      {/* Hero Header */}
      <section style={{
        backgroundColor: 'var(--color-ink-950)',
        color: 'var(--color-paper-50)',
        padding: '3.5rem 0 3rem',
        borderBottom: '1px solid var(--color-ink-800)'
      }}>
        <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-sand-300)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}>
            Digital Cultural &amp; Architectural Heritage Archive
          </div>
          <h1 style={{
            fontSize: '2.4rem',
            lineHeight: 1.25,
            marginBottom: '1rem',
            color: 'var(--color-paper-50)'
          }}>
            Explore India's cultural memory, one place at a time.
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-stone-400)',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Preserving architectural observations, historical manuscripts, stepwell hydrology, and living traditions with rigorous provenance and attribution.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by monument, region, keyword, or inscription..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem'
                }}
              />
              <Search size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-stone-400)'
              }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', fontSize: '0.95rem' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Catalogue Section */}
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        {/* Controls / Filter Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--color-paper-200)'
        }}>
          {/* Filter options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-stone-600)', fontSize: '0.85rem' }}>
              <Filter size={15} />
              <span>Filters:</span>
            </div>

            <select
              className="form-control"
              value={type}
              onChange={(e) => updateFilter('type', e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
            >
              {TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <input
              type="text"
              className="form-control"
              placeholder="Filter by region (e.g. Patan)..."
              value={region}
              onChange={(e) => updateFilter('region', e.target.value)}
              style={{ width: '180px', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
            />

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              >
                <X size={13} />
                Clear Filters
              </button>
            )}
          </div>

          {/* Sort & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-stone-600)' }}>
              Showing <strong>{items.length}</strong> of <strong>{meta.total}</strong> records
            </span>

            <select
              className="form-control"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Records Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone-600)' }}>
            Retrieving published archive items...
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchItems} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No matching archive records"
            message="No published heritage records match your current search criteria."
            actionLabel="Reset Search"
            onAction={clearAllFilters}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {items.map(item => (
              <Link
                key={item.id}
                to={`/archive/${item.id}`}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                {/* Image Media Thumbnail */}
                <div style={{
                  height: '210px',
                  backgroundColor: 'var(--color-paper-100)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {item.primary_media_key ? (
                    <img
                      src={`/api/v1/media/${item.primary_media_id}/view`}
                      alt={item.primary_media_alt || item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--color-paper-200)',
                      color: 'var(--color-stone-600)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem'
                    }}>
                      ARCHIVAL RECORD #{item.id}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem'
                  }}>
                    <span className="badge badge-type" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                      {item.item_type}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--color-bronze-600)',
                    marginBottom: '0.4rem',
                    fontWeight: 500
                  }}>
                    <MapPin size={13} />
                    <span>{item.location_name || item.region}</span>
                  </div>

                  <h3 style={{
                    fontSize: '1.15rem',
                    marginBottom: '0.5rem',
                    lineHeight: 1.35,
                    color: 'var(--color-ink-950)'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-stone-600)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    flex: 1
                  }}>
                    {item.summary}
                  </p>

                  <div style={{
                    borderTop: '1px solid var(--color-paper-200)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-stone-600)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={13} color="var(--color-bronze-600)" />
                      {item.rights_status.replace('_', ' ')}
                    </span>

                    <span style={{ color: 'var(--color-bronze-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Inspect <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
            {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => updateFilter('page', String(p))}
                className={p === meta.page ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ minWidth: '36px' }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
