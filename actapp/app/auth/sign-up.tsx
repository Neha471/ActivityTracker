import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { darkTheme } from '../../theme';

export default function SignUpScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colors.background === darkTheme.colors.background ? 'light' : 'dark'} />
        
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join us today!</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <View>
            <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="Create a password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Must be at least 8 characters
            </Text>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginTop: spacing.sm,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, { marginTop: spacing.xl }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    width: '100%',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '500',
  },
});
