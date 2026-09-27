import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, fontSize, fontWeight } from '../theme/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const { palette } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    flex: { flex: 1 },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.xxl,
    },
    brand: { alignItems: 'center', marginBottom: spacing.xxl },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: palette.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    logoText: { color: palette.white, fontSize: 32, fontWeight: fontWeight.bold },
    appName: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.extrabold,
      color: palette.textPrimary,
    },
    tagline: { fontSize: fontSize.sm, color: palette.textTertiary, marginTop: 2 },
    card: {
      backgroundColor: palette.surface,
      borderRadius: 20,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: palette.border,
      marginBottom: spacing.lg,
    },
    heading: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: palette.textPrimary,
      marginBottom: 4,
    },
    sub: {
      fontSize: fontSize.base,
      color: palette.textSecondary,
      marginBottom: spacing.xl,
    },
    errorBanner: {
      backgroundColor: palette.errorBg,
      color: palette.error,
      padding: spacing.md,
      borderRadius: 8,
      fontSize: fontSize.sm,
      marginBottom: spacing.md,
    },
    btn: { marginTop: spacing.sm },
    toggle: { color: palette.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: palette.textSecondary, fontSize: fontSize.base },
    link: { color: palette.primary, fontWeight: fontWeight.semibold, fontSize: fontSize.base },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>✓</Text>
            </View>
            <Text style={styles.appName}>TaskFlow</Text>
            <Text style={styles.tagline}>Quiet Precision</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.sub}>Join TaskFlow today</Text>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Ganesh Vallabh"
              autoCorrect={false}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              placeholder="Min 6 characters"
              rightIcon={
                <Pressable onPress={() => setShowPw(v => !v)}>
                  <Text style={styles.toggle}>{showPw ? 'Hide' : 'Show'}</Text>
                </Pressable>
              }
            />

            <Button
              label="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.btn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
