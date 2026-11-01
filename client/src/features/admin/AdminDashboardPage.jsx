import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../app/AuthContext';
import { useTranslation } from '../../utils/i18n';
import ErrorState from '../../components/ErrorState';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  HardDrive, 
  Download, 
  Activity, 
  Clock, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, hasRole } = useAuth();
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, logsRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/audit-logs', { per_page: 20 })
      ]);

      setMetrics(metricsRes.data);
      setAuditLogs(logsRes.data || []);

      if (hasRole('admin')) {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load platform governance data.');
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setStatusMessage(null);
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setStatusMessage(`User role successfully updated to ${newRole}.`);
      // Refresh users list
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data || []);
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

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
            {t('admin_title', 'Platform Governance & Administration')}
          </h1>
          <p style={{ color: 'var(--color-stone-600)', fontSize: '0.9rem' }}>
            {t('admin_subtitle', 'System metrics, user access controls, audit trail, and OAIS archival export manifest.')}
          </p>
        </div>

        {/* Archival Export Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="/api/v1/archive-export?format=json"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} />
            Export OAIS JSON
          </a>
          <a
            href="/api/v1/archive-export?format=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} />
            Export CSV
          </a>
        </div>
      </div>

      {statusMessage && (
        <div style={{
          backgroundColor: '#E8F5E9',
          color: 'var(--color-green-700)',
          border: '1px solid #C8E6C9',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          fontSize: '0.88rem'
        }}>
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-stone-600)' }}>
          Loading governance analytics...
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadAdminData} />
      ) : (
        <div>
          {/* Key Metric Counters */}
          {metrics && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-green-700)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-stone-600)', fontWeight: 600 }}>
                  Published Archives
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.2rem' }}>
                  {metrics.records.published}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', marginTop: '0.2rem' }}>
                  Total registered: {metrics.records.total}
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-amber-700)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-stone-600)', fontWeight: 600 }}>
                  Awaiting Peer Review
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-amber-700)', marginTop: '0.2rem' }}>
                  {metrics.records.pending_review}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', marginTop: '0.2rem' }}>
                  Drafts in progress: {metrics.records.draft}
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-blue-700)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-stone-600)', fontWeight: 600 }}>
                  Master Assets &amp; Media
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.2rem' }}>
                  {metrics.media_assets_count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', marginTop: '0.2rem' }}>
                  Total size: {(metrics.total_storage_bytes / 1024).toFixed(1)} KB
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-bronze-600)' }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-stone-600)', fontWeight: 600 }}>
                  Cultural Geography
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-ink-950)', marginTop: '0.2rem' }}>
                  {metrics.locations_count}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-400)', marginTop: '0.2rem' }}>
                  Curated trails: {metrics.collections_count}
                </div>
              </div>
            </div>
          )}

          {/* User & Role Administration (Admin only) */}
          {hasRole('admin') && users.length > 0 && (
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--color-paper-200)',
                paddingBottom: '0.65rem'
              }}>
                <Users size={18} color="var(--color-bronze-600)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink-950)' }}>
                  User Accounts &amp; Role Management
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-paper-200)', color: 'var(--color-stone-600)' }}>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Name &amp; Email</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Institution</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Assigned Role</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Registered Date</th>
                      <th style={{ padding: '0.65rem 0.75rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--color-paper-100)' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-ink-950)' }}>{u.full_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-600)' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--color-stone-600)' }}>
                          {u.organization || 'Independent'}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className={`badge ${
                            u.role === 'admin' ? 'badge-published' : 
                            u.role === 'reviewer' ? 'badge-type' : 
                            u.role === 'researcher' ? 'badge-pending' : 'badge-draft'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--color-stone-600)', fontSize: '0.8rem' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <select
                            className="form-control"
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            <option value="visitor">visitor</option>
                            <option value="researcher">researcher</option>
                            <option value="reviewer">reviewer</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Log Trail */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--color-paper-200)',
              paddingBottom: '0.65rem'
            }}>
              <Activity size={18} color="var(--color-bronze-600)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink-950)' }}>
                System Audit Trail (Security &amp; Preservation Log)
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {auditLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-paper-50)',
                    border: '1px solid var(--color-paper-200)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Clock size={14} color="var(--color-stone-400)" />
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--color-ink-950)' }}>
                        {log.action}
                      </span>
                      <span style={{ color: 'var(--color-stone-600)', marginLeft: '0.4rem' }}>
                        on {log.entity_type} #{log.entity_id}
                      </span>
                      {log.details?.title && (
                        <span style={{ fontStyle: 'italic', color: 'var(--color-stone-600)', marginLeft: '0.4rem' }}>
                          ("{log.details.title}")
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: 'var(--color-stone-600)' }}>
                    <span>By: <strong>{log.actor_name || 'System'}</strong></span>
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
