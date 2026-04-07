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

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successDialog, setSuccessDialog] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword =
        'Confirm password is required';
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      if (response?.token) {
        await AsyncStorage.setItem(
          'userToken',
          response.token
        );
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );

        setSuccessDialog(true);

        setTimeout(() => {
          navigation.replace('ProjectInfo');
        }, 900);
      } else if (response?.message) {
        Alert.alert('Signup Failed', response.message);
      } else {
        Alert.alert(
          'Signup Failed',
          'Failed to create account'
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred during signup';

      Alert.alert('Signup Failed', errorMessage);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join the BioLens intelligence ecosystem
        </Text>
      </Animated.View>

      {successDialog && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.dialogOverlay}
        >
          <Text style={styles.dialogText}>
            🎉 Signed up successfully
          </Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(700)}>
        <GlassCard style={styles.formCard}>
          <Text style={styles.formTitle}>
            Start Your Research Journey
          </Text>
          <Text style={styles.formSubtitle}>
            Create your secure BioLens account to unlock AI-driven
            diatom intelligence.
          </Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            value={formData.name}
            onChangeText={(text) =>
              setFormData({ ...formData, name: text })
            }
            editable={!isLoading}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              errors.email && styles.inputError,
            ]}
            placeholder="researcher@biolens.ai"
            placeholderTextColor="#9ca3af"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
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
            placeholder="Minimum 6 characters"
            placeholderTextColor="#9ca3af"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            editable={!isLoading}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password}
            </Text>
          )}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[
              styles.input,
              errors.confirmPassword &&
                styles.inputError,
            ]}
            placeholder="Confirm password"
            placeholderTextColor="#9ca3af"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                confirmPassword: text,
              })
            }
            editable={!isLoading}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>
              {errors.confirmPassword}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Create BioLens Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
            style={styles.loginLinkContainer}
          >
            <Text style={styles.link}>
              Already registered?{' '}
              <Text style={styles.linkBold}>Login</Text>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  title: {
    fontSize: typography.heading2 + 4,
    fontWeight: typography.weightBold,
    color: '#fff',
  },

  subtitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.82)',
    marginTop: spacing.xs,
  },

  formCard: {
    marginTop: -28,
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
  },

  link: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.body,
  },

  linkBold: {
    fontWeight: typography.weightBold,
    color: colors.primary,
  },

  loginLinkContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },

  dialogOverlay: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
  },

  dialogText: {
    color: '#fff',
    fontWeight: typography.weightBold,
    fontSize: typography.body,
  },
});