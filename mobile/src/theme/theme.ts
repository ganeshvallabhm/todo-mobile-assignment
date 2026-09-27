// ──────────────────────────────────────────────
// TaskFlow "Quiet Precision" Design System
// ──────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';

export const lightTheme = {
  mode: 'light' as const,
  // Brand
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  subtleSurface: '#F1F5F9',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',

  // Borders
  border: '#E2E8F0',

  // Status
  completed: '#10B981',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  warning: '#F97316',

  // Priority
  priority: {
    urgent: { bg: '#FEF2F2', text: '#991B1B', indicator: '#EF4444' },
    high: { bg: '#FFF7ED', text: '#9A3412', indicator: '#F97316' },
    medium: { bg: '#EFF6FF', text: '#1E40AF', indicator: '#3B82F6' },
    low: { bg: '#F0FDF4', text: '#166534', indicator: '#22C55E' },
  },

  white: '#FFFFFF',
  black: '#000000',
};

export const darkTheme = {
  mode: 'dark' as const,
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  background: '#0F172A',
  surface: '#1E293B',
  subtleSurface: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  border: '#475569',
  completed: '#10B981',
  error: '#F87171',
  errorBg: '#4B1D1D',
  warning: '#F59E0B',
  priority: {
    urgent: { bg: '#7F1D1D', text: '#FECACA', indicator: '#F87171' },
    high: { bg: '#7C2D12', text: '#FED7AA', indicator: '#FB923C' },
    medium: { bg: '#1E3A8A', text: '#BFDBFE', indicator: '#60A5FA' },
    low: { bg: '#14532D', text: '#BBF7D0', indicator: '#4ADE80' },
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const themeTokens = {
  light: lightTheme,
  dark: darkTheme,
};

export const colors = { ...lightTheme };

export const getThemeColors = (mode: ThemeMode = 'light') => themeTokens[mode];

export const applyThemeMode = (mode: ThemeMode) => {
  const next = getThemeColors(mode);
  Object.assign(colors, next);
  return colors;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
};

export const fontWeight: Record<string, '400' | '500' | '600' | '700' | '800'> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};
