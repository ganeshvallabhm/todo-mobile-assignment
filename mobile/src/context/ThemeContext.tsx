import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, applyThemeMode, getThemeColors } from '../theme/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  palette: ReturnType<typeof getThemeColors>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'taskflow-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMode === 'dark' || storedMode === 'light') {
          setMode(storedMode);
          applyThemeMode(storedMode);
        } else {
          applyThemeMode('light');
        }
      } catch {
        applyThemeMode('light');
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    applyThemeMode(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => undefined);
  }, [mode]);

  const palette = useMemo(() => getThemeColors(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      toggleTheme: () => setMode(current => (current === 'dark' ? 'light' : 'dark')),
      setTheme: next => setMode(next),
      palette,
    }),
    [mode, palette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
