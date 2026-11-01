import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Compass, 
  ShieldCheck, 
  Database, 
  Cpu, 
  FileSearch, 
  Map, 
  Layers, 
  Award,
  ArrowRight
} from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Virasat Atlas",
    subtitle: "Map-First Digital Heritage & Architectural Archive",
    tagline: "Find the story behind the archive — by subject, place, time and source.",
    content: (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: '#8A5A32',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '2.5rem',
          fontFamily: 'serif',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 14px rgba(138, 90, 50, 0.4)'
        }}>
          V
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#17191B', marginBottom: '0.75rem', fontFamily: 'serif' }}>
          VIRASAT ATLAS
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#8A5A32', fontWeight: 600, marginBottom: '1.5rem' }}>
          Map-First Digital Revitalisation of Cultural &amp; Architectural Archives
        </p>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#EEE8DD',
          padding: '0.6rem 1.5rem',
          borderRadius: '30px',
          fontSize: '0.95rem',
          color: '#17191B'
        }}>
          Challenge: <strong>HC26-CULT01</strong> • <strong>Blithchron '27, IIT Gandhinagar</strong>
        </div>
        <div style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: '#6F6A61' }}>
          Core Stack: React.js + PHP 8.3 REST API + MySQL 8+ / MariaDB
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "The Problem Space",
    subtitle: "Fragmentation of India's Cultural Memory",
    content: (
      <div>
        <p style={{ fontSize: '1.1rem', color: '#6F6A61', marginBottom: '2rem', lineHeight: 1.6 }}>
          Cultural expeditions generate rich photographs, regional manuscripts, field notes, and architectural observations. Currently, these exist scattered across presentation decks, local hard drives, and untagged cloud folders.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderLeft: '4px solid #9A3D35', borderRadius: '4px' }}>
            <h4 style={{ color: '#9A3D35', marginBottom: '0.4rem' }}>1. Low Discoverability</h4>
            <p style={{ fontSize: '0.9rem', color: '#17191B' }}>Valuable field data is locked in unstructured slides and isolated folders; researchers cannot search cross-institutionally.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderLeft: '4px solid #875B19', borderRadius: '4px' }}>
            <h4 style={{ color: '#875B19', marginBottom: '0.4rem' }}>2. Lost Historical Context</h4>
            <p style={{ fontSize: '0.9rem', color: '#17191B' }}>Photographs become separated from their geo-coordinates, construction era, and creator notes.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderLeft: '4px solid #315B73', borderRadius: '4px' }}>
            <h4 style={{ color: '#315B73', marginBottom: '0.4rem' }}>3. Limited Public Access</h4>
            <p style={{ fontSize: '0.9rem', color: '#17191B' }}>No accessible interface exists for students, historians, or citizens to navigate material geographically.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderLeft: '4px solid #8A5A32', borderRadius: '4px' }}>
            <h4 style={{ color: '#8A5A32', marginBottom: '0.4rem' }}>4. Weak Preservation Governance</h4>
            <p style={{ fontSize: '0.9rem', color: '#17191B' }}>Absence of formal provenance tracking, license verification, and human editorial quality gates.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "The Virasat Atlas Solution",
    subtitle: "A Structured, Location-Aware Preservation Engine",
    content: (
      <div>
        <div style={{
          backgroundColor: '#8A5A32',
          color: '#fff',
          padding: '1.25rem 1.75rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          fontFamily: 'serif'
        }}>
          "Turn scattered field observations into structured cultural records that anyone can search, locate, understand, and explore through curated collections."
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={18} color="#8A5A32" /> Structured Ingestion
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6F6A61' }}>Researchers document title, type, period, language, source collection, and verified coordinates.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="#8A5A32" /> Editorial Quality Gate
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6F6A61' }}>Review queue requires explicit license attribution and checks claims before public release.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Map size={18} color="#8A5A32" /> Map-First Exploration
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#6F6A61' }}>Discover heritage sites by spatial coordinates, hydrological relationships, and curated trails.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "System Architecture",
    subtitle: "Modular Monolith Built for Reliability and Speed",
    content: (
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div style={{ backgroundColor: '#17191B', color: '#F7F4EE', padding: '1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            <div style={{ color: '#D9C4A2', fontWeight: 'bold', marginBottom: '0.75rem' }}>[ Architectural Layers ]</div>
            <div>Browser (React 18 + Vite)</div>
            <div style={{ color: '#6F6A61' }}>   ↓ HTTPS JSON / multipart (REST)</div>
            <div>Front Controller (api/index.php)</div>
            <div style={{ color: '#6F6A61' }}>   ↓ Middleware (Auth, CORS, RBAC)</div>
            <div>Controllers &amp; Validators (api/src/*)</div>
            <div style={{ color: '#6F6A61' }}>   ↓ Repositories (PDO Prepared SQL)</div>
            <div style={{ color: '#315B73' }}>MySQL 8+ / MariaDB Database</div>
            <div style={{ color: '#8A5A32' }}>Private Storage (api/storage/uploads)</div>
          </div>
          <div>
            <h4 style={{ color: '#17191B', marginBottom: '0.75rem' }}>Key Architectural Decisions:</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.65rem', fontSize: '0.9rem', color: '#6F6A61' }}>
              <li>• <strong>No Node.js or Python backend server:</strong> Pure native PHP 8.3 REST API in <code>api/</code>.</li>
              <li>• <strong>Secure Media Isolation:</strong> Files stored outside public root with random SHA-256 keys.</li>
              <li>• <strong>PDO Prepared Statements:</strong> 100% parameterised SQL queries against SQL injection.</li>
              <li>• <strong>Deterministic RBAC:</strong> Server-side authority for Visitor, Researcher, Reviewer, Admin.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Database Schema (ER Model)",
    subtitle: "Relational Integrity with MySQL 8+ / InnoDB",
    content: (
      <div>
        <p style={{ fontSize: '0.95rem', color: '#6F6A61', marginBottom: '1.25rem' }}>
          10 normalised tables in <code>database/schema.sql</code> enforcing strict foreign key constraints and indexed search capabilities:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>users</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>id, email, password_hash, role, organization</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>locations</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>id, name, region, latitude, longitude, is_approximate</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #8A5A32', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>archive_items</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>title, type, summary, status, rights, FULLTEXT key</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>media_assets</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>storage_key, mime, sha256_checksum, alt_text, is_primary</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>tags / mapping</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>archive_item_tags (M:N normalized)</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>collections / items</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>collection_items (ordered sequence + notes)</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>ocr_jobs</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>raw_text, reviewed_text, language, status</div>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#F7F4EE', border: '1px solid #EEE8DD', borderRadius: '4px' }}>
            <strong style={{ color: '#8A5A32' }}>audit_logs</strong>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61', marginTop: '0.2rem' }}>user_id, action, entity_id, timestamp, ip</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Ingestion & Editorial QA Pipeline",
    subtitle: "From Raw Fieldwork to Peer-Approved Cultural Record",
    content: (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F7F4EE',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#6F6A61', color: '#fff', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Draft Creation</div>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61' }}>Researcher Entry</div>
          </div>
          <ArrowRight size={20} color="#8A5A32" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#8A5A32', color: '#fff', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Asset Upload</div>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61' }}>Validation &amp; Checksum</div>
          </div>
          <ArrowRight size={20} color="#8A5A32" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#875B19', color: '#fff', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Peer Review Queue</div>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61' }}>Rights &amp; Provenance QA</div>
          </div>
          <ArrowRight size={20} color="#8A5A32" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2E6B4B', color: '#fff', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Public Release</div>
            <div style={{ fontSize: '0.75rem', color: '#6F6A61' }}>Catalogue &amp; Map Search</div>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#6F6A61', lineHeight: 1.6 }}>
          Reviewers can either <strong>Approve</strong> (transitioning record to <code>published</code>), or <strong>Request Corrections</strong> with a mandatory feedback note. Rejected records return to the researcher's workspace for revision.
        </p>
      </div>
    )
  },
  {
    id: 7,
    title: "Map & Thematic Exploration",
    subtitle: "Spatial Context as a First-Class Citizen",
    content: (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#17191B', marginBottom: '0.5rem' }}>Leaflet + OpenStreetMap Canvas</h4>
            <p style={{ fontSize: '0.88rem', color: '#6F6A61', lineHeight: 1.6, marginBottom: '1rem' }}>
              Every geotagged monument is rendered as an interactive archival pin. Selecting a pin highlights coordinates, displays item counts, and opens site records directly.
            </p>
            <div style={{ padding: '0.75rem', backgroundColor: '#F7F4EE', borderLeft: '3px solid #8A5A32', fontSize: '0.82rem', color: '#17191B' }}>
              <strong>Accessibility Guard:</strong> A fully synchronised accessible list view fallback ensures no visitor is blocked if map tiles fail to load.
            </div>
          </div>
          <div>
            <h4 style={{ color: '#17191B', marginBottom: '0.5rem' }}>Curated Collections &amp; Trails</h4>
            <p style={{ fontSize: '0.88rem', color: '#6F6A61', lineHeight: 1.6, marginBottom: '1rem' }}>
              Reviewers curate ordered thematic sequences (e.g. <em>Stepwells of Western India: Sacred Subterranean Waters</em>), allowing visitors to navigate architectural journeys with curator notes.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "OCR & Paleographic Assistant",
    subtitle: "Human-in-the-Loop Archival Verification",
    content: (
      <div>
        <div style={{
          backgroundColor: '#FFF8E1',
          border: '1px solid #FFE082',
          padding: '1rem 1.25rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#875B19'
        }}>
          <strong>Archival Standard FR-14:</strong> Machine OCR is draft data. False historical certainty is prevented by keeping raw extractions separate from human-reviewed text.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#F7F4EE', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#875B19' }}>Raw Extraction</span>
            <p style={{ fontSize: '0.85rem', color: '#6F6A61', marginTop: '0.5rem' }}>
              Automated character recognition with confidence score. Contains glyph uncertainty markers <code>[?]</code>. Never treated as authoritative.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#E8F5E9', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 'bold', color: '#2E6B4B' }}>Human-Reviewed Transcript</span>
            <p style={{ fontSize: '0.85rem', color: '#17191B', marginTop: '0.5rem' }}>
              Archivist verifies against master inscription image. <strong>Only human-reviewed text is indexed in the MySQL FULLTEXT search engine.</strong>
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Scalability & Technical Roadmap",
    subtitle: "Built for Institutional Expansion",
    content: (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.4rem' }}>Phase 1-3 (Now)</h4>
            <div style={{ fontSize: '0.82rem', color: '#2E6B4B', fontWeight: 600, marginBottom: '0.5rem' }}>DELIVERED &amp; OPERATIONAL</div>
            <p style={{ fontSize: '0.85rem', color: '#6F6A61' }}>React + PHP + MySQL stack, media ingestion, role gates, Leaflet map, collections, OCR assistant.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.4rem' }}>Post-Hackathon</h4>
            <div style={{ fontSize: '0.82rem', color: '#8A5A32', fontWeight: 600, marginBottom: '0.5rem' }}>INFRASTRUCTURE EXPANSION</div>
            <p style={{ fontSize: '0.85rem', color: '#6F6A61' }}>S3-compatible object storage for high-res master scans, asynchronous PDF thumbnail pipeline.</p>
          </div>
          <div style={{ padding: '1.25rem', backgroundColor: '#F7F4EE', borderRadius: '6px' }}>
            <h4 style={{ color: '#17191B', marginBottom: '0.4rem' }}>Long-Term Vision</h4>
            <div style={{ fontSize: '0.82rem', color: '#315B73', fontWeight: 600, marginBottom: '0.5rem' }}>HERITAGE AI EXTENSION</div>
            <p style={{ fontSize: '0.85rem', color: '#6F6A61' }}>Vector semantic search across Indic languages, photogrammetry 3D digital twins.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "Submission & Live Verification",
    subtitle: "HC26-CULT01 • Blithchron '27, IIT Gandhinagar",
    content: (
      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#E8F5E9',
          color: '#2E6B4B',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <Award size={30} />
        </div>
        <h3 style={{ fontSize: '1.6rem', color: '#17191B', marginBottom: '0.5rem' }}>
          Fully Operational Hackathon Prototype
        </h3>
        <p style={{ color: '#6F6A61', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
          Every feature in this deck is running live on the local development environment and verified through automated end-to-end regression tests.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-primary">
            Launch Live Archive Explorer
          </Link>
          <Link to="/map" className="btn btn-secondary">
            Open Interactive Map
          </Link>
        </div>
      </div>
    )
  }
];

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide(c => Math.max(0, c - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(c => Math.min(SLIDES.length - 1, c + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '980px' }}>
      {/* Top Deck Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-bronze-600)' }}>
            SLIDE {slide.id} OF {SLIDES.length}
          </span>
          <span style={{ color: 'var(--color-stone-400)' }}>•</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-stone-600)' }}>
            {slide.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-outline btn-sm"
            title="Print or Export Pitch Deck as PDF"
          >
            <Printer size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="card" style={{
        padding: '3rem 3.5rem',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--color-paper-100)',
            paddingBottom: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-bronze-600)', fontWeight: 700 }}>
                {slide.subtitle}
              </div>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)', marginTop: '0.2rem' }}>
                {slide.title}
              </h2>
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'serif',
              color: 'var(--color-stone-400)'
            }}>
              {slide.id.toString().padStart(2, '0')}
            </div>
          </div>

          <div>
            {slide.content}
          </div>
        </div>

        {/* Slide Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-paper-200)',
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: 'var(--color-stone-400)'
        }}>
          <div>
            Virasat Atlas • HC26-CULT01 • Blithchron '27, IIT Gandhinagar
          </div>
          <div>
            Slide {slide.id} / 10
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="btn btn-secondary btn-sm"
        >
          <ChevronLeft size={16} /> Previous Slide
        </button>

        {/* Slide indicator dots */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: idx === currentSlide ? 'var(--color-bronze-600)' : 'var(--color-paper-200)',
                transition: 'all 0.2s ease'
              }}
              title={`Jump to slide ${s.id}: ${s.title}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="btn btn-primary btn-sm"
        >
          Next Slide <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
