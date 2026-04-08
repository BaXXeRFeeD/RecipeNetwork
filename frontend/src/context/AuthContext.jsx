import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api } from '../lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'recipe-network-auth-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const me = await api.getMe(token);
        if (isMounted) {
          setUser(me);
        }
      } catch (_error) {
        if (isMounted) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const persistAuth = (payload) => {
    localStorage.setItem(STORAGE_KEY, payload.accessToken);
    setToken(payload.accessToken);
    setUser(payload.user);
  };

  const login = async (values) => {
    const payload = await api.login(values);
    persistAuth(payload);
    return payload.user;
  };

  const register = async (values) => {
    const payload = await api.register(values);
    persistAuth(payload);
    return payload.user;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const me = await api.getMe(token);
    setUser(me);
    return me;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [isBootstrapping, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }

  return context;
}
