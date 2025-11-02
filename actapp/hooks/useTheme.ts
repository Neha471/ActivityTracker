import { useThemeContext } from '../context/ThemeContext';
import { Theme } from '../theme';

export const useTheme = (): {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  borderRadius: Theme['borderRadius'];
} => {
  const { theme, isDark, toggleTheme } = useThemeContext();
  
  return {
    theme,
    isDark,
    toggleTheme,
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };
};

// Export a simple hook that just returns the theme colors
export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

// Export a hook that returns spacing utilities
export const useSpacing = () => {
  const { spacing } = useTheme();
  return spacing;
};

// Export a hook that returns border radius utilities
export const useBorderRadius = () => {
  const { borderRadius } = useTheme();
  return borderRadius;
};
