import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { useAuth } from './AuthContext';

import ArchiveListPage from '../features/archive/ArchiveListPage';
import ArchiveDetailPage from '../features/archive/ArchiveDetailPage';
import MapPage from '../features/map/MapPage';
import CollectionsPage from '../features/collections/CollectionsPage';
import LoginPage from '../features/auth/LoginPage';
import WorkspacePage from '../features/workspace/WorkspacePage';
import ContributePage from '../features/workspace/ContributePage';
import ReviewQueuePage from '../features/review/ReviewQueuePage';

// Protected Route Guard
function RequireAuth({ children, minimumRole = 'researcher' }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-stone-600)' }}>
        Verifying credentials...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(minimumRole)) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-red-700)', marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--color-stone-600)' }}>
          This workspace section requires the <strong>{minimumRole}</strong> role or higher.
        </p>
      </div>
    );
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ArchiveListPage /> },
      { path: 'archive/:id', element: <ArchiveDetailPage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'workspace',
        element: (
          <RequireAuth minimumRole="researcher">
            <WorkspacePage />
          </RequireAuth>
        )
      },
      {
        path: 'contribute',
        element: (
          <RequireAuth minimumRole="researcher">
            <ContributePage />
          </RequireAuth>
        )
      },
      {
        path: 'contribute/:id',
        element: (
          <RequireAuth minimumRole="researcher">
            <ContributePage />
          </RequireAuth>
        )
      },
      {
        path: 'review-queue',
        element: (
          <RequireAuth minimumRole="reviewer">
            <ReviewQueuePage />
          </RequireAuth>
        )
      },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
