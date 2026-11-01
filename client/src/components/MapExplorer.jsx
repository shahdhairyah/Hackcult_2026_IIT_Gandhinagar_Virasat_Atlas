import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix standard Leaflet default icon path issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Archival Marker Icon
const createArchivalIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: ${isSelected ? '34px' : '28px'};
        height: ${isSelected ? '34px' : '28px'};
        border-radius: 50%;
        background-color: ${isSelected ? '#8A5A32' : '#315B73'};
        border: 2px solid #F7F4EE;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-family: serif;
        font-weight: bold;
        font-size: ${isSelected ? '14px' : '12px'};
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ✦
      </div>
    `,
    iconSize: isSelected ? [34, 34] : [28, 28],
    iconAnchor: isSelected ? [17, 17] : [14, 14],
    popupAnchor: [0, -18]
  });
};

export default function MapExplorer({ locations, selectedLocation, onSelectLocation, height = '460px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center on Gujarat (Western India)
    const initialLat = 23.2;
    const initialLng = 72.6;
    const initialZoom = 8;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors | Virasat Atlas'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !locations || locations.length === 0) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const bounds = [];

    locations.forEach(loc => {
      const lat = parseFloat(loc.latitude);
      const lng = parseFloat(loc.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      const isSelected = selectedLocation?.id === loc.id;
      const marker = L.marker([lat, lng], {
        icon: createArchivalIcon(isSelected),
        title: loc.name
      }).addTo(map);

      // Popup Content
      const popupContent = `
        <div style="font-family: inherit; padding: 4px; max-width: 240px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #8A5A32; font-weight: 700; letter-spacing: 0.04em;">
            ${loc.region || 'Heritage Site'}
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #17191B; margin: 3px 0 6px; line-height: 1.3;">
            ${loc.name}
          </div>
          <div style="font-size: 12px; color: #6F6A61; margin-bottom: 8px;">
            ${loc.item_count} published archival record(s)
          </div>
          <a href="/?region=${encodeURIComponent(loc.region)}" style="
            display: inline-block;
            background-color: #8A5A32;
            color: #F7F4EE;
            text-decoration: none;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          ">
            View Site Records &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectLocation) {
          onSelectLocation(loc);
        }
      });

      markersRef.current[loc.id] = marker;
    });

    if (bounds.length > 0 && !selectedLocation) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [locations]);

  // Highlight and pan to selected location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLocation) return;

    const lat = parseFloat(selectedLocation.latitude);
    const lng = parseFloat(selectedLocation.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    map.panTo([lat, lng], { animate: true, duration: 0.6 });

    // Update marker icons
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = String(id) === String(selectedLocation.id);
      marker.setIcon(createArchivalIcon(isSelected));
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [selectedLocation]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-paper-200)'
      }}
    />
  );
}
