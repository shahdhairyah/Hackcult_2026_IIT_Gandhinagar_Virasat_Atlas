import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { Compass, Map, Layers, PlusCircle, CheckSquare, LogOut, User, FolderArchive } from 'lucide-react';

export default function SiteHeader() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
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
        paddingBottom: '0.85rem'
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
              VIRASAT ATLAS
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--color-sand-300)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Digital Cultural Archive
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Compass size={16} />
            Explore
          </NavLink>

          <NavLink 
            to="/map" 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Map size={16} />
            Map
          </NavLink>

          <NavLink 
            to="/collections" 
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
              borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
              paddingBottom: '0.2rem'
            })}
          >
            <Layers size={16} />
            Collections
          </NavLink>

          {/* Researcher Workspace */}
          {hasRole('researcher') && (
            <NavLink 
              to="/workspace" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
                borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
                paddingBottom: '0.2rem'
              })}
            >
              <FolderArchive size={16} />
              My Workspace
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
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? 'var(--color-sand-300)' : 'var(--color-paper-100)',
                borderBottom: isActive ? '2px solid var(--color-sand-300)' : '2px solid transparent',
                paddingBottom: '0.2rem'
              })}
            >
              <CheckSquare size={16} />
              Review Queue
            </NavLink>
          )}
        </nav>

        {/* Auth / Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {hasRole('researcher') && (
            <Link to="/contribute" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              Contribute
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                textAlign: 'right',
                display: 'none',
                lineHeight: 1.2
              }} className="user-info-text">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-paper-50)' }}>
                  {user.full_name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-sand-300)', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>

              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-ink-800)',
                border: '1px solid var(--color-sand-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-sand-300)',
                fontSize: '0.85rem',
                fontWeight: 600
              }} title={`${user.full_name} (${user.role})`}>
                {user.full_name.charAt(0)}
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-sand-300)', borderColor: 'rgba(217, 196, 162, 0.4)' }}
                title="Sign out"
              >
                <LogOut size={15} />
                <span style={{ fontSize: '0.8rem' }}>Sign out</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <User size={15} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
