import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const { 
    colors, 
    spacing, 
    borderRadius, 
    isDark, 
    toggleTheme 
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { 
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
      }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome to Your App
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, marginTop: spacing.sm }]}>
          Current theme: {isDark ? 'Dark' : 'Light'}
        </Text>
        
        <View style={[styles.themeExample, { 
          backgroundColor: colors.primary + '20', // Add transparency
          borderColor: colors.primary,
          marginTop: spacing.lg,
          padding: spacing.md,
          borderRadius: borderRadius.sm,
        }]}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            Primary Color Example
          </Text>
        </View>

        <TouchableOpacity 
          onPress={toggleTheme}
          style={[styles.toggleButton, {
            backgroundColor: colors.primary,
            marginTop: spacing.xl,
            padding: spacing.md,
            borderRadius: borderRadius.md,
          }]}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>
            {isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  themeExample: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  toggleButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
});
