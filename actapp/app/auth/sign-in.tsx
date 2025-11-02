import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { darkTheme } from '../../theme';

export default function SignInScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colors.background === darkTheme.colors.background ? 'light' : 'dark'} />
        
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
        </View>

        <View style={{ gap: spacing.md }}>
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
            <View style={styles.passwordHeader}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Password
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
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
              placeholder="Enter your password"
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
                marginTop: spacing.lg,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, { marginTop: spacing.xl }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              Sign up
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
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
