import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import MapExplorer from '../../components/MapExplorer';
import ErrorState from '../../components/ErrorState';
import { MapPin, Compass, ArrowRight, List, Map as MapIcon, Globe, Info } from 'lucide-react';

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'map' | 'list'

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/locations');
      const data = res.data || [];
      setLocations(data);
      if (data.length > 0) {
        setSelectedLoc(data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load heritage map locations.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Page Title & View Controls */}
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
            Geospatial Heritage Map
          </h1>
          <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
            Interactive Leaflet exploration of geocoded stepwells, monuments, and archaeological sites across Western India.
          </p>
        </div>

        {/* View Switcher for mobile / accessibility */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--color-paper-100)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewMode('both')}
            className={viewMode === 'both' ? 'btn btn-secondary btn-sm' : 'btn btn-sm'}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={viewMode === 'map' ? 'btn btn-secondary btn-sm' : 'btn btn-sm'}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <MapIcon size={13} />
            Map Canvas
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'btn btn-secondary btn-sm' : 'btn btn-sm'}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <List size={13} />
            List Fallback
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone-600)' }}>
          Plotting georeferenced sites on OpenStreetMap...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLocations} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'map' ? '1fr' : (viewMode === 'list' ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))'),
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Map Section */}
          {viewMode !== 'list' && (
            <div>
              <MapExplorer
                locations={locations}
                selectedLocation={selectedLoc}
                onSelectLocation={(loc) => setSelectedLoc(loc)}
                height="520px"
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-stone-600)',
                marginTop: '0.75rem'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe size={13} color="var(--color-bronze-600)" />
                  Click any marker or cluster to inspect provenance and records
                </span>
                <span>OpenStreetMap &amp; Leaflet Engine</span>
              </div>
            </div>
          )}

          {/* Location Sidebar & Accessible Fallback List */}
          {viewMode !== 'map' && (
            <div>
              {/* Selected Location Card */}
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
                    Georeferenced Cultural Site
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
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <MapPin size={14} color="var(--color-bronze-600)" />
                    <span>{selectedLoc.region}, {selectedLoc.state || 'Gujarat'}</span>
                    <span>•</span>
                    <span className="badge badge-published" style={{ fontSize: '0.72rem' }}>
                      {selectedLoc.item_count} Published Record(s)
                    </span>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--color-paper-100)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    fontFamily: 'monospace',
                    color: 'var(--color-blue-700)'
                  }}>
                    GPS: {parseFloat(selectedLoc.latitude).toFixed(5)}° N, {parseFloat(selectedLoc.longitude).toFixed(5)}° E
                    {selectedLoc.is_approximate ? ' (Approximate)' : ' (Exact Site Coordinate)'}
                  </div>

                  {selectedLoc.notes && (
                    <p style={{ fontSize: '0.88rem', color: 'var(--color-stone-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {selectedLoc.notes}
                    </p>
                  )}

                  <Link
                    to={`/?region=${encodeURIComponent(selectedLoc.region)}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    View All Records from {selectedLoc.region}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* Accessible List View */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.88rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-stone-600)',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--color-paper-200)',
                  paddingBottom: '0.5rem'
                }}>
                  Geotagged Heritage Records List ({locations.length})
                </h4>

                <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                  {locations.map(loc => {
                    const isSelected = selectedLoc?.id === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLoc(loc)}
                        style={{
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? 'var(--color-bronze-600)' : 'var(--color-paper-200)'}`,
                          backgroundColor: isSelected ? 'rgba(138, 90, 50, 0.06)' : '#fff',
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
                            {loc.region} • {parseFloat(loc.latitude).toFixed(4)}°N, {parseFloat(loc.longitude).toFixed(4)}°E
                          </div>
                        </div>
                        <span className="badge badge-published" style={{ fontSize: '0.7rem' }}>
                          {loc.item_count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
