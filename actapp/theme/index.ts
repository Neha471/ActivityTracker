import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

type Theme = {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
};

const lightColors: ThemeColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#10B981',
  primaryVariant: '#059669',
  secondary: '#3B82F6',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#34D399',
  primaryVariant: '#10B981',
  secondary: '#60A5FA',
  textPrimary: '#F9FAFB',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
};

const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
};

const lightTheme: Theme = {
  colors: lightColors,
  ...commonTheme,
};

const darkTheme: Theme = {
  colors: darkColors,
  ...commonTheme,
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  
  return useMemo(() => {
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
    return theme;
  }, [colorScheme]);
};

export { lightTheme, darkTheme };
export type { Theme, ThemeColors };
