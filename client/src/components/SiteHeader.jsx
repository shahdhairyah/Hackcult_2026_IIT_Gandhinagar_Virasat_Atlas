import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { useTranslation } from '../utils/i18n';
import { 
  Compass, 
  Map, 
  Layers, 
  PlusCircle, 
  CheckSquare, 
  LogOut, 
  User, 
  FolderArchive,
  Shield,
  Globe
} from 'lucide-react';

export default function SiteHeader() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { language, setLanguage, t, languages } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-ink-950)',
      color: 'var(--color-paper-50)',
      borderBottom: '2px solid var(--color-bronze-600)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        paddingBottom: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            backgroundColor: 'var(--color-bronze-600)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            fontFamily: 'var(--font-serif)'
          }}>
            V
          </div>
          <div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: '700',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.04em',
              color: 'var(--color-paper-50)'
            }}>
              {t('brand_title', 'VIRASAT ATLAS')}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--color-sand-300)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {t('brand_subtitle', 'Digital Cultural Archive')}
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Compass size={15} />
            {t('nav_explore', 'Explore')}
          </NavLink>

          <NavLink 
            to="/map" 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Map size={15} />
            {t('nav_map', 'Map')}
          </NavLink>

          <NavLink 
            to="/collections" 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Layers size={15} />
            {t('nav_collections', 'Collections')}
          </NavLink>

          <NavLink 
            to="/pitch" 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Compass size={15} />
            {t('nav_pitch', 'Pitch Deck')}
          </NavLink>

          {/* Researcher Workspace */}
          {hasRole('researcher') && (
            <NavLink 
              to="/workspace" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
                borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
                paddingBottom: '0.2rem'
              })}
            >
              <FolderArchive size={15} />
              {t('nav_workspace', 'My Workspace')}
            </NavLink>
          )}

          {/* Review Queue */}
          {hasRole('reviewer') && (
            <NavLink 
              to="/review-queue" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
                borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
                paddingBottom: '0.2rem'
              })}
            >
              <CheckSquare size={15} />
              {t('nav_review', 'Review Queue')}
            </NavLink>
          )}

          {/* Admin Governance */}
          {(hasRole('admin') || hasRole('reviewer')) && (
            <NavLink 
              to="/admin" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
                borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
                paddingBottom: '0.2rem'
              })}
            >
              <Shield size={15} />
              {t('nav_admin', 'Admin')}
            </NavLink>
          )}
        </nav>

        {/* Right Actions: Language Switcher & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Multilingual Selector (FR-17) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 4px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Globe size={13} color="var(--color-sand-300)" style={{ marginLeft: '4px', marginRight: '4px' }} />
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                style={{
                  background: language === l.code ? 'var(--color-bronze-600)' : 'transparent',
                  color: language === l.code ? '#fff' : 'var(--color-sand-300)',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 6px',
                  fontSize: '0.72rem',
                  fontWeight: language === l.code ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={l.label}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>

          {hasRole('researcher') && (
            <Link to="/contribute" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              <span>Contribute</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-ink-800)',
                border: '1px solid var(--color-sand-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-sand-300)',
                fontSize: '0.8rem',
                fontWeight: 600
              }} title={`${user.full_name} (${user.role})`}>
                {user.full_name.charAt(0)}
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-sand-300)', borderColor: 'rgba(217, 196, 162, 0.4)', padding: '0.3rem 0.6rem' }}
                title="Sign out"
              >
                <LogOut size={14} />
                <span style={{ fontSize: '0.78rem' }}>{t('nav_signout', 'Sign out')}</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <User size={14} />
              {t('nav_signin', 'Sign in')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
