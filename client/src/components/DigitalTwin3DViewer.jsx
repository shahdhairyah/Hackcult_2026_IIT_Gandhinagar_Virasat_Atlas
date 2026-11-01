import React, { useRef, useEffect, useState } from 'react';
import { Box, Layers, Eye, Droplets, RotateCcw, Info, Maximize2 } from 'lucide-react';

export default function DigitalTwin3DViewer({ 
  monumentTitle = "Rani ki Vav (Subterranean Inverted Temple)",
  height = "480px"
}) {
  const canvasRef = useRef(null);
  const [rotationX, setRotationX] = useState(25);
  const [rotationY, setRotationY] = useState(-35);
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [waterLevel, setWaterLevel] = useState(30); // percentage
  const [renderMode, setRenderMode] = useState('shaded'); // 'shaded' | 'wireframe' | 'cutaway'
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  const ANNOTATIONS = [
    { id: 1, name: "Tier 1: Stepped Entry Pavilion", yPct: 80, desc: "Entrance pavilion with ceremonial stairs descending into the subterranean levels." },
    { id: 2, name: "Tier 4: Sculptural Sandstone Gallery", yPct: 50, desc: "Over 500 high-relief sculptures representing the Dashavatara avatars of Vishnu." },
    { id: 3, name: "Tier 7: Deep Subterranean Well Shaft", yPct: 20, desc: "Circular well shaft penetrating down to the alluvial groundwater aquifer." }
  ];

  // Mouse interaction handlers for 3D Orbit
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    setRotationY(prev => prev + dx * 0.4);
    setRotationX(prev => Math.max(-10, Math.min(65, prev - dy * 0.4)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.6, Math.min(1.8, prev - e.deltaY * 0.001)));
  };

  // Canvas 3D isometric projection loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#17191B');
      bg.addColorStop(1, '#24282C');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Coordinate transformation setup
      const cx = width / 2;
      const cy = height / 2 + 30;
      const radX = (rotationX * Math.PI) / 180;
      const radY = (rotationY * Math.PI) / 180;

      // Project 3D point (x, y, z) into 2D screen space
      const project = (x, y, z) => {
        // Rotate around Y
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Scale by zoom
        return {
          x: cx + x1 * zoom,
          y: cy + y2 * zoom,
          depth: z2
        };
      };

      // Draw Subterranean Stepwell Tiers (7 terraced inverted levels)
      const tiers = 7;
      const maxRadius = 150;
      const totalDepth = 140;

      // Draw tier steps from top to bottom
      for (let t = 0; t < tiers; t++) {
        const ratio = (tiers - t) / tiers;
        const r = maxRadius * ratio;
        const yTop = -40 + (t * (totalDepth / tiers));
        const yBottom = yTop + (totalDepth / tiers) - 4;

        // Draw isometric octagonal / rectangular step pavilion
        const corners = 8;
        const ptsTop = [];
        const ptsBottom = [];

        for (let i = 0; i < corners; i++) {
          const angle = (i * 2 * Math.PI) / corners;
          const px = Math.cos(angle) * r;
          const pz = Math.sin(angle) * r;
          ptsTop.push(project(px, yTop, pz));
          ptsBottom.push(project(px, yBottom, pz));
        }

        // Draw side walls of the tier
        for (let i = 0; i < corners; i++) {
          const next = (i + 1) % corners;
          ctx.beginPath();
          ctx.moveTo(ptsTop[i].x, ptsTop[i].y);
          ctx.lineTo(ptsTop[next].x, ptsTop[next].y);
          ctx.lineTo(ptsBottom[next].x, ptsBottom[next].y);
          ctx.lineTo(ptsBottom[i].x, ptsBottom[i].y);
          ctx.closePath();

          if (renderMode === 'wireframe') {
            ctx.strokeStyle = '#D9C4A2';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            // Stone texture shading
            const brightness = 140 - (t * 12) + (i % 2 === 0 ? 15 : -15);
            ctx.fillStyle = `rgb(${brightness}, ${brightness - 25}, ${brightness - 50})`;
            ctx.fill();
            ctx.strokeStyle = 'rgba(23, 25, 27, 0.4)';
            ctx.stroke();
          }
        }

        // Pillar column details along pavilions
        if (renderMode !== 'cutaway' || t > 1) {
          for (let p = 0; p < 4; p++) {
            const pa = (p * Math.PI) / 2;
            const pr = r * 0.75;
            const pt1 = project(Math.cos(pa) * pr, yTop, Math.sin(pa) * pr);
            const pt2 = project(Math.cos(pa) * pr, yBottom, Math.sin(pa) * pr);

            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.strokeStyle = renderMode === 'wireframe' ? '#F7F4EE' : '#8A5A32';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
        }
      }

      // Draw Dynamic Groundwater Surface Plane
      const waterHeight = -40 + totalDepth - (waterLevel / 100) * totalDepth;
      const waterRadius = maxRadius * (1 - (waterLevel / 100) * 0.6);
      const waterPts = [];
      for (let i = 0; i < 8; i++) {
        const a = (i * 2 * Math.PI) / 8;
        waterPts.push(project(Math.cos(a) * waterRadius, waterHeight, Math.sin(a) * waterRadius));
      }

      ctx.beginPath();
      ctx.moveTo(waterPts[0].x, waterPts[0].y);
      for (let i = 1; i < waterPts.length; i++) {
        ctx.lineTo(waterPts[i].x, waterPts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = renderMode === 'wireframe' ? 'rgba(49, 91, 115, 0.4)' : 'rgba(49, 91, 115, 0.75)';
      ctx.fill();
      ctx.strokeStyle = '#68B0D8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ripple lines on water
      ctx.beginPath();
      const wCenter = project(0, waterHeight, 0);
      ctx.ellipse(wCenter.x, wCenter.y, waterRadius * 0.5 * zoom, waterRadius * 0.25 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();
    };

    render();
  }, [rotationX, rotationY, zoom, waterLevel, renderMode]);

  return (
    <div className="card" style={{ overflow: 'hidden', backgroundColor: '#17191B', color: '#fff' }}>
      {/* 3D Viewer Header Controls */}
      <div style={{
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={18} color="var(--color-sand-300)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F7F4EE' }}>
            3D Digital Twin: {monumentTitle}
          </span>
        </div>

        {/* Shading & Wireframe Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setRenderMode('shaded')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: renderMode === 'shaded' ? 'var(--color-bronze-600)' : 'rgba(255,255,255,0.08)',
              color: '#fff'
            }}
          >
            Carved Stone
          </button>
          <button
            onClick={() => setRenderMode('wireframe')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: renderMode === 'wireframe' ? 'var(--color-bronze-600)' : 'rgba(255,255,255,0.08)',
              color: '#fff'
            }}
          >
            Wireframe Mesh
          </button>
          <button
            onClick={() => { setRotationX(25); setRotationY(-35); setZoom(1.0); }}
            style={{
              padding: '0.3rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: '#D9C4A2'
            }}
            title="Reset 3D Orbit Camera"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <div style={{ position: 'relative', height: height, cursor: isDragging ? 'grabbing' : 'grab' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Orbit Helper Tip */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          backgroundColor: 'rgba(23, 25, 27, 0.75)',
          padding: '0.35rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.72rem',
          color: 'var(--color-sand-300)',
          pointerEvents: 'none'
        }}>
          Click &amp; drag to rotate 3D pavilion • Scroll to zoom
        </div>

        {/* Water Table Level Slider */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(23, 25, 27, 0.85)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '0.65rem 0.85rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          zIndex: 5
        }}>
          <Droplets size={16} color="#68B0D8" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#EEE8DD', fontWeight: 600 }}>
              Hydraulic Water Table: {waterLevel}%
            </span>
            <input
              type="range"
              min="5"
              max="95"
              value={waterLevel}
              onChange={(e) => setWaterLevel(parseInt(e.target.value, 10))}
              style={{ width: '110px', height: '4px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Structural Tier Callouts */}
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#1E2226',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem'
      }}>
        {ANNOTATIONS.map(ann => (
          <div
            key={ann.id}
            onClick={() => setActiveAnnotation(ann)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: activeAnnotation?.id === ann.id ? 'rgba(138, 90, 50, 0.25)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeAnnotation?.id === ann.id ? 'var(--color-bronze-600)' : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#D9C4A2' }}>
              {ann.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9E998F', marginTop: '0.2rem' }}>
              {ann.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

