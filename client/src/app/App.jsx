import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function App() {
  return (
    <AuthProvider>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-paper-50)'
      }}>
        <SiteHeader />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </AuthProvider>
  );
}

