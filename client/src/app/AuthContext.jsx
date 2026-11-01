import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const ROLE_WEIGHTS = {
  visitor: 0,
  researcher: 1,
  reviewer: 2,
  admin: 3
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        if (res.data.csrf_token) {
          api.setCsrfToken(res.data.csrf_token);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.user) {
      setUser(res.data.user);
      if (res.data.token) {
        api.setToken(res.data.token);
      }
      if (res.data.csrf_token) {
        api.setCsrfToken(res.data.csrf_token);
      }
    }
    return res.data;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      api.setToken(null);
      api.setCsrfToken(null);
    }
  }

  function hasRole(minimumRole) {
    if (!user) return false;
    const userRoleWeight = ROLE_WEIGHTS[user.role] ?? -1;
    const requiredWeight = ROLE_WEIGHTS[minimumRole] ?? 99;
    return userRoleWeight >= requiredWeight;
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

