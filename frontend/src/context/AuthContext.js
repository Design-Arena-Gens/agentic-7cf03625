import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { saveToken, clearToken, getToken } from '../storage/auth-storage.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        }
      } catch (err) {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        await saveToken(data.token);
        const profile = await api.get('/auth/me');
        setUser(profile.data.user);
      },
      register: async (payload) => {
        const { data } = await api.post('/auth/register', payload);
        await saveToken(data.token);
        const profile = await api.get('/auth/me');
        setUser(profile.data.user);
      },
      socialLogin: async (payload) => {
        const { data } = await api.post('/auth/social', payload);
        await saveToken(data.token);
        const profile = await api.get('/auth/me');
        setUser(profile.data.user);
      },
      logout: async () => {
        await clearToken();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
