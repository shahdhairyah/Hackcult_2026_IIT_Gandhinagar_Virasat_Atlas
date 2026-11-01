import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ErrorState from '../../components/ErrorState';
import { MapPin, Compass, ArrowRight, Layers, ExternalLink } from 'lucide-react';

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/locations');
      setLocations(res.data || []);
      if (res.data?.length > 0) {
        setSelectedLoc(res.data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load heritage map locations.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)' }}>
          Geospatial Heritage Exploration
        </h1>
        <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
          Explore verified monument locations, stepwell hydraulic networks, and field survey coordinates.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone-600)' }}>
          Plotting heritage coordinates...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLocations} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Interactive Geographic Canvas / Map Preview */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: '#1A1D20', color: '#fff' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-sand-300)' }}>
                <Compass size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Western India Heritage Coordinate Grid
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                WGS 84 Datum
              </span>
            </div>

            {/* Visual Vector Map representation */}
            <div style={{
              position: 'relative',
              height: '380px',
              backgroundColor: '#24282C',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Subtle coordinate grid lines */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Render Interactive Coordinate Pins */}
              {locations.map((loc, idx) => {
                const isSelected = selectedLoc?.id === loc.id;
                // Normalize lat 22-24, lon 72-74 to 0-100% coords
                const x = Math.min(85, Math.max(15, ((parseFloat(loc.longitude) - 72.0) / 2.0) * 80 + 10));
                const y = Math.min(85, Math.max(15, 100 - (((parseFloat(loc.latitude) - 22.0) / 2.0) * 80 + 10)));

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      zIndex: isSelected ? 10 : 2
                    }}
                    title={`${loc.name} (${loc.item_count} items)`}
                  >
                    <div style={{
                      width: isSelected ? '32px' : '24px',
                      height: isSelected ? '32px' : '24px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--color-bronze-600)' : 'var(--color-blue-700)',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      transition: 'all 0.2s ease'
                    }}>
                      <MapPin size={isSelected ? 16 : 12} />
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(23, 25, 27, 0.85)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      border: isSelected ? '1px solid var(--color-sand-300)' : 'none'
                    }}>
                      {loc.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '0.85rem'
            }}>
              <span>Leaflet / OpenStreetMap Geo-Coordinate Integration</span>
              <span>{locations.length} Sites Geotagged</span>
            </div>
          </div>

          {/* Location Detail & Accessible List */}
          <div>
            {selectedLoc && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', borderTop: '4px solid var(--color-bronze-600)' }}>
                <div style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-bronze-600)',
                  fontWeight: 600,
                  marginBottom: '0.35rem'
                }}>
                  Selected Heritage Site
                </div>

                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-ink-950)', marginBottom: '0.5rem' }}>
                  {selectedLoc.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-stone-600)',
                  marginBottom: '1rem'
                }}>
                  <MapPin size={14} color="var(--color-bronze-600)" />
                  <span>{selectedLoc.region}, {selectedLoc.state || 'Gujarat'}</span>
                  <span>•</span>
                  <span>{selectedLoc.item_count} Published Records</span>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-paper-100)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  fontFamily: 'monospace'
                }}>
                  Lat: {selectedLoc.latitude}° N • Lon: {selectedLoc.longitude}° E
                </div>

                {selectedLoc.notes && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-stone-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {selectedLoc.notes}
                  </p>
                )}

                <Link
                  to={`/?region=${selectedLoc.region}`}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  Explore Records from {selectedLoc.region}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Accessible Site List Fallback */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--color-stone-600)',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--color-paper-200)',
                paddingBottom: '0.5rem'
              }}>
                All Georeferenced Sites
              </h4>

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {locations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${selectedLoc?.id === loc.id ? 'var(--color-bronze-600)' : 'var(--color-paper-200)'}`,
                      backgroundColor: selectedLoc?.id === loc.id ? 'rgba(138, 90, 50, 0.05)' : '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-ink-950)' }}>
                        {loc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-600)' }}>
                        {loc.region}
                      </div>
                    </div>
                    <span className="badge badge-published" style={{ fontSize: '0.7rem' }}>
                      {loc.item_count} items
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
