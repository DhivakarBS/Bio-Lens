import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import GlassCard from '../components/GlassCard';
import { authService } from '../services';
import { RootStackParamList } from '../types/type';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response?.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );

        navigation.navigate('ProjectInfo');
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid credentials or server error'
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred during login';

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(650)}
        style={styles.hero}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.title}>BioLens</Text>
        <Text style={styles.subtitle}>
          Premium Diatom Intelligence Portal
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(700)}>
        <GlassCard style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>
            Sign in to access your environmental intelligence dashboard
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="researcher@biolens.ai"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              styles.input,
              errors.password && styles.inputError,
            ]}
            placeholder="Enter secure password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Access Dashboard
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={styles.signupLinkContainer}
          >
            <Text style={styles.link}>
              New to BioLens?{' '}
              <Text style={styles.linkBold}>Create Account</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AdminLogin')}
            style={styles.adminLink}
          >
            <Text style={styles.adminLinkText}>
              Secure Admin Access
            </Text>
          </TouchableOpacity>
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  title: {
    fontSize: 34,
    fontWeight: typography.weightBold,
    color: '#fff',
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.82)',
    marginTop: spacing.xs,
  },

  formCard: {
    marginTop: -30,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: 30,
  },

  formTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.weightBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },

  formSubtitle: {
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    backgroundColor: '#fff',
    width: '100%',
  },

  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    zIndex: 500,
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 8,
  },

  label: {
    fontSize: typography.small,
    fontWeight: typography.weightSemiBold,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },

  inputError: {
    borderColor: colors.danger,
  },

  errorText: {
    color: colors.danger,
    fontSize: typography.micro,
    marginTop: 4,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    letterSpacing: 0.4,
  },

  link: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.body,
  },

  linkBold: {
    fontWeight: typography.weightBold,
    color: colors.primary,
  },

  adminLink: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  adminLinkText: {
    textAlign: 'center',
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: typography.weightBold,
  },

  signupLinkContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});