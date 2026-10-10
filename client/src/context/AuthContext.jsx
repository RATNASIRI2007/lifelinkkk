import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  // Restore the session when the page loads.
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => {
    const authenticate = async (path, body) => {
      const data = await api(path, { method: 'POST', body });
      setToken(data.token);
      setUser(data.user);
      return data.user;
    };
    return {
      user,
      loading,
      isAdmin: user?.role === 'admin',
      login: (body) => authenticate('/auth/login', body),
      register: (body) => authenticate('/auth/register', body),
      logout: () => {
        setToken(null);
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
