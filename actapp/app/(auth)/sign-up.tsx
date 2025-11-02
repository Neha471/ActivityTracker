import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { darkTheme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const { register, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(firstName, lastName, email, password);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error(error);
    }
  };
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
              First Name
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
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View>
            <Text style={[styles.label, { color: colors.textPrimary, marginBottom: spacing.xs }]}>
              Last Name
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
              value={lastName}
              onChangeText={setLastName}
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
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
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
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
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
              placeholder="Confirm password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
              onSubmitEditing={handleSignUp}
              returnKeyType="go"
            />
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          ) : null}
          
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                marginTop: spacing.lg,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.footer, { marginTop: spacing.xl }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/sign-in')}
            disabled={isLoading}
          >
            <Text style={[styles.footerLink, { 
              color: colors.primary,
              opacity: isLoading ? 0.7 : 1,
            }]}>
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
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
