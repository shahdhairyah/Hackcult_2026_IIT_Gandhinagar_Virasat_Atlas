import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import UploadDropzone from '../../components/UploadDropzone';
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Info, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Tag, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const ITEM_TYPES = [
  { value: 'monument', label: 'Monument / Memorial' },
  { value: 'architecture', label: 'Architectural Structure / Vav' },
  { value: 'craft', label: 'Living Craft / Textile Heritage' },
  { value: 'document', label: 'Archival Document / Manuscript' },
  { value: 'photograph', label: 'Documentary Photograph' },
  { value: 'field_note', label: 'Researcher Field Note' },
  { value: 'oral_history', label: 'Oral History / Audio Observation' },
  { value: 'other', label: 'Other Heritage Asset' }
];

const RIGHTS_OPTIONS = [
  { value: 'public_domain', label: 'Public Domain (Expired copyright / Dedicated to public)' },
  { value: 'cc_by', label: 'Creative Commons Attribution (CC-BY 4.0)' },
  { value: 'cc_by_sa', label: 'Creative Commons Attribution-ShareAlike (CC-BY-SA 4.0)' },
  { value: 'cc_by_nc', label: 'Creative Commons NonCommercial (CC-BY-NC 4.0)' },
  { value: 'permission_granted', label: 'Permission Granted by Institution / Rightsholder' },
  { value: 'permission_pending', label: 'Permission Pending (Archive use only, non-public)' },
  { value: 'restricted', label: 'Restricted / Sensitive Cultural Asset' },
  { value: 'unknown', label: 'Rights Unknown (Cannot be published publicly)' }
];

export default function ContributePage() {
  const { id } = useParams(); // If editing an existing draft
  const isEditing = !!id;

  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    item_type: 'architecture',
    summary: '',
    description: '',
    region: 'Gujarat',
    location_id: '',
    latitude: '',
    longitude: '',
    capture_date: '',
    historical_period: '',
    language: 'English',
    creator: user?.full_name || '',
    source: '',
    rights_status: 'cc_by_sa',
    attribution_text: '',
    status: 'draft',
    tags: 'stepwell, water-architecture'
  });

  // Media state
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaAlt, setMediaAlt] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [existingMedia, setExistingMedia] = useState([]);

  // UI state
  const [locations, setLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadLocations();
    if (isEditing) {
      loadRecord(id);
    }
  }, [id]);

  async function loadLocations() {
    try {
      const res = await api.get('/locations/all');
      setLocations(res.data || []);
    } catch (err) {
      // ignore
    }
  }

  async function loadRecord(recordId) {
    try {
      const res = await api.get(`/archive-items/${recordId}`);
      const item = res.data;
      if (item) {
        setFormData({
          title: item.title || '',
          item_type: item.item_type || 'architecture',
          summary: item.summary || '',
          description: item.description || '',
          region: item.region || '',
          location_id: item.location_id ? String(item.location_id) : '',
          latitude: item.latitude || '',
          longitude: item.longitude || '',
          capture_date: item.capture_date || '',
          historical_period: item.historical_period || '',
          language: item.language || 'English',
          creator: item.creator || '',
          source: item.source || '',
          rights_status: item.rights_status || 'unknown',
          attribution_text: item.attribution_text || '',
          status: item.status || 'draft',
          tags: item.tags ? item.tags.map(t => t.name).join(', ') : ''
        });
        setExistingMedia(item.media || []);
      }
    } catch (err) {
      setGlobalError('Failed to load the draft record for editing.');
    }
  }

  const handleLocationChange = (locId) => {
    const selected = locations.find(l => String(l.id) === String(locId));
    if (selected) {
      setFormData(prev => ({
        ...prev,
        location_id: locId,
        region: selected.region,
        latitude: selected.latitude || prev.latitude,
        longitude: selected.longitude || prev.longitude
      }));
    } else {
      setFormData(prev => ({ ...prev, location_id: locId }));
    }
  };

  const handleSubmit = async (submitStatus) => {
    setErrors({});
    setGlobalError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    // Format tags
    const tagArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      ...formData,
      status: submitStatus,
      tags: tagArray,
      location_id: formData.location_id ? parseInt(formData.location_id, 10) : null
    };

    try {
      let savedItem;
      if (isEditing) {
        const res = await api.patch(`/archive-items/${id}`, payload);
        savedItem = res.data;
      } else {
        const res = await api.post('/archive-items', payload);
        savedItem = res.data;
      }

      // If a new media file was selected, upload it and link to item
      if (mediaFile && savedItem?.id) {
        const uploadForm = new FormData();
        uploadForm.append('file', mediaFile);
        uploadForm.append('alt_text', mediaAlt || formData.title);
        if (mediaCaption) {
          uploadForm.append('caption', mediaCaption);
        }
        await api.upload(`/archive-items/${savedItem.id}/media`, uploadForm);
      }

      setSuccessMessage(
        submitStatus === 'pending_review' 
          ? 'Record successfully submitted for editorial review!' 
          : 'Draft saved successfully.'
      );

      setTimeout(() => {
        navigate('/workspace');
      }, 1200);

    } catch (err) {
      if (err.fields) {
        setErrors(err.fields);
      }
      setGlobalError(err.message || 'Failed to save archive record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <Link to="/workspace" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--color-stone-600)',
            marginBottom: '0.5rem'
          }}>
            <ArrowLeft size={14} /> Back to My Workspace
          </Link>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--color-ink-950)' }}>
            {isEditing ? 'Edit Archive Record' : 'Contribute Archive Record'}
          </h1>
          <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
            Document cultural and architectural heritage with rigorous provenance, attribution, and location context.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
            className="btn btn-secondary"
          >
            <Save size={15} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('pending_review')}
            disabled={submitting}
            className="btn btn-primary"
          >
            <Send size={15} />
            Submit for Review
          </button>
        </div>
      </div>

      {/* Global alert messages */}
      {globalError && (
        <div style={{
          backgroundColor: '#FFEBEE',
          border: '1px solid #FFCDD2',
          color: 'var(--color-red-700)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <AlertCircle size={18} />
          <span>{globalError}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#E8F5E9',
          border: '1px solid #C8E6C9',
          color: 'var(--color-green-700)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Section 1: Record Identification */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-ink-950)',
          borderBottom: '1px solid var(--color-paper-200)',
          paddingBottom: '0.75rem'
        }}>
          <FileText size={18} color="var(--color-bronze-600)" />
          1. Record Identification
        </h3>

        <div className="form-group">
          <label className="form-label">
            Record Title <span style={{ color: 'var(--color-red-700)' }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Subterranean Sculptural Pavilions of Rani ki Vav"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
          <div className="form-helper">
            Clear, descriptive title. Avoid unsupported or hyperbolic historical claims.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">
              Heritage Item Type <span style={{ color: 'var(--color-red-700)' }}>*</span>
            </label>
            <select
              className="form-control"
              value={formData.item_type}
              onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
            >
              {ITEM_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {errors.item_type && <div className="form-error">{errors.item_type}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Source Language
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. English, Gujarati, Sanskrit"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Summary <span style={{ color: 'var(--color-red-700)' }}>*</span>
          </label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="One or two concise sentences summarising the item for catalogue cards."
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
          />
          {errors.summary && <div className="form-error">{errors.summary}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Comprehensive Description &amp; Architectural Observations
          </label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Detailed architectural description, construction chronology, historical attribution, and material analysis. Distinguish verifiable facts from hypotheses."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      {/* Section 2: Spatial & Temporal Context */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-ink-950)',
          borderBottom: '1px solid var(--color-paper-200)',
          paddingBottom: '0.75rem'
        }}>
          <MapPin size={18} color="var(--color-bronze-600)" />
          2. Spatial &amp; Temporal Context
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">
              Associated Named Location
            </label>
            <select
              className="form-control"
              value={formData.location_id}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="">-- Choose known heritage site or enter custom --</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.region}, {loc.state || 'India'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Region / Administrative District <span style={{ color: 'var(--color-red-700)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Patan, Gandhinagar, Mehsana"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
            />
            {errors.region && <div className="form-error">{errors.region}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 23.8589000"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            />
            {errors.latitude && <div className="form-error">{errors.latitude}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 72.1018000"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            />
            {errors.longitude && <div className="form-error">{errors.longitude}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: 0 }}>
          <div className="form-group">
            <label className="form-label">Historical Period / Dynasty</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 11th Century CE (Solanki Dynasty)"
              value={formData.historical_period}
              onChange={(e) => setFormData({ ...formData, historical_period: e.target.value })}
            />
            <div className="form-helper">Approximate historical era of the monument or asset.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Observation / Fieldwork Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.capture_date}
              onChange={(e) => setFormData({ ...formData, capture_date: e.target.value })}
            />
            <div className="form-helper">Modern survey date (distinct from historical period).</div>
          </div>
        </div>
      </div>

      {/* Section 3: Provenance & Rights */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-ink-950)',
          borderBottom: '1px solid var(--color-paper-200)',
          paddingBottom: '0.75rem'
        }}>
          <ShieldCheck size={18} color="var(--color-bronze-600)" />
          3. Provenance &amp; Rights Compliance
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">
              Source / Originating Collection <span style={{ color: 'var(--color-red-700)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. IITGN Cultural Heritage Lab Field Survey #04"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
            />
            {errors.source && <div className="form-error">{errors.source}</div>}
            <div className="form-helper">Where the material originated or who supplied it.</div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Creator / Field Investigator
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Aarav Patel / Heritage Survey Team"
              value={formData.creator}
              onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Rights &amp; Permission Status <span style={{ color: 'var(--color-red-700)' }}>*</span>
          </label>
          <select
            className="form-control"
            value={formData.rights_status}
            onChange={(e) => setFormData({ ...formData, rights_status: e.target.value })}
          >
            {RIGHTS_OPTIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.rights_status && <div className="form-error">{errors.rights_status}</div>}
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            Verbatim Attribution Statement
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Photographed by Aarav Patel, licensed under CC-BY-SA 4.0."
            value={formData.attribution_text}
            onChange={(e) => setFormData({ ...formData, attribution_text: e.target.value })}
          />
          {errors.attribution_text && <div className="form-error">{errors.attribution_text}</div>}
          <div className="form-helper">
            Required when publishing under Creative Commons or granted institutional license.
          </div>
        </div>
      </div>

      {/* Section 4: Master Media Upload */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-ink-950)',
          borderBottom: '1px solid var(--color-paper-200)',
          paddingBottom: '0.75rem'
        }}>
          <Info size={18} color="var(--color-bronze-600)" />
          4. Master Media Asset
        </h3>

        {existingMedia.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-ink-800)' }}>
              Currently Attached Media:
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {existingMedia.map(m => (
                <div key={m.id} style={{
                  padding: '0.75rem',
                  border: '1px solid var(--color-paper-200)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-paper-50)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.85rem'
                }}>
                  <img 
                    src={`/api/v1/media/${m.id}/view`} 
                    alt={m.alt_text || 'Media preview'} 
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.original_filename}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-600)' }}>
                      {(m.file_size / 1024).toFixed(1)} KB • {m.is_primary ? 'Primary view' : 'Secondary'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <UploadDropzone
          onFileSelected={(file) => setMediaFile(file)}
          selectedFile={mediaFile}
          onClear={() => setMediaFile(null)}
          altText={mediaAlt}
          setAltText={setMediaAlt}
          caption={mediaCaption}
          setCaption={setMediaCaption}
        />
      </div>

      {/* Section 5: Controlled Tags */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{
          fontSize: '1.15rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-ink-950)',
          borderBottom: '1px solid var(--color-paper-200)',
          paddingBottom: '0.75rem'
        }}>
          <Tag size={18} color="var(--color-bronze-600)" />
          5. Curatorial Tags
        </h3>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Comma-Separated Tags</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. stepwell, water-architecture, solanki-dynasty, stone-carving"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
          <div className="form-helper">
            Tags enable discovery across heritage trails and themed collections.
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-paper-200)'
      }}>
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={submitting}
          className="btn btn-secondary"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <Save size={16} />
          {submitting ? 'Saving...' : 'Save as Draft'}
        </button>

        <button
          type="button"
          onClick={() => handleSubmit('pending_review')}
          disabled={submitting}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem' }}
        >
          <Send size={16} />
          {submitting ? 'Submitting...' : 'Submit for Editorial Review'}
        </button>
      </div>
    </div>
  );
}

