import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/authApi';
import { User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // true while restoring session

  // On app start: read token from storage and validate it with the backend
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem('token');
        if (stored) {
          const res = await authApi.getMe();
          setToken(stored);
          setUser(res.data.data.user);
        }
      } catch {
        // Token invalid or network error — clear it and show Login
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { token: jwt, user: me } = res.data.data;
    await AsyncStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(me);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authApi.register(name, email, password);
      const { token: jwt, user: me } = res.data.data;
      await AsyncStorage.setItem('token', jwt);
      setToken(jwt);
      setUser(me);
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
