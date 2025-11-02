import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const CustomLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...lightTheme.colors,
  },
};

const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...darkTheme.colors,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigationTheme = isDark ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeProvider>
      <NavThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavThemeProvider>
    </ThemeProvider>
  );
}
