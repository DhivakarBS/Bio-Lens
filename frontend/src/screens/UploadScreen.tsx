import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';

import api from '../services/api';
import { RootStackParamList } from '../types/type';
import AnimatedScanButton from '../components/AnimatedScanButton';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';

const windowWidth = Dimensions.get('window').width;

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

export default function UploadScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to upload images'
        );
      }
    })();
  }, []);

  const scanAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    scanAnimation.value = withRepeat(
      withTiming(1, {
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      false
    );

    glowAnimation.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const scanningLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanAnimation.value * 280 }],
    opacity: image ? 1 : 0,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowRadius: image ? 28 : 0,
    shadowOpacity: image ? 0.2 : 0,
    opacity: image ? 1 : 0,
  }));

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      setLoading(true);
      let result;

      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets?.[0]) {
        const uri = result.assets[0].uri;
        const base64 = await convertImageToBase64(uri);
        setImage(base64);
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = async (
    uri: string
  ): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleClassify = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    try {
      setClassifying(true);

      const response = await api.classifyImage(image);

      if (response?.success) {
        navigation.navigate('Result', {
          result: response.classification,
        });
        setImage(null);
        return;
      }

      Alert.alert(
        'Prediction Failed',
        response?.message || 'Could not classify image'
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Classification failed. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setClassifying(false);
    }
  };

  const previewUri = image
    ? `data:image/jpeg;base64,${image}`
    : undefined;

  return (
    <View style={styles.screen}>
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.header}
      >
        <Text style={styles.pageTitle}>BioLens AI Scan Lab</Text>
        <Text style={styles.pageSubtitle}>
          Premium microscopic intelligence workflow
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(550)}>
          <GlassCard style={styles.dropZone}>
            <SectionHeader
              title="Upload Sample"
              subtitle="Select a microscopic image for enterprise-grade ecological diagnostics"
            />

            <TouchableOpacity
              style={styles.uploadZone}
              activeOpacity={0.9}
              onPress={() => pickImage('gallery')}
              disabled={loading || classifying}
            >
              <View style={styles.dashedBorder}>
                <Ionicons
                  name="scan-circle-outline"
                  size={56}
                  color={colors.primary}
                />
                <Text style={styles.uploadHint}>
                  Tap to browse microscopy images
                </Text>
                <Text style={styles.uploadSubHint}>
                  AI-ready drag & drop style zone
                </Text>
              </View>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {previewUri ? (
          <Animated.View entering={FadeInUp.delay(120).duration(550)}>
            <GlassCard style={styles.previewCard}>
              <SectionHeader
                title="Live Preview"
                subtitle="AI scan visualization"
              />

              <Image
                source={{ uri: previewUri }}
                style={styles.previewImage}
              />

              <Animated.View
                style={[styles.scanAccent, glowStyle]}
              />
              <Animated.View
                style={[styles.scanLine, scanningLineStyle]}
              />
            </GlassCard>
          </Animated.View>
        ) : null}

        <GlassCard style={styles.statusBlock}>
          <SectionHeader
            title="AI Diagnostic Pipeline"
            subtitle="Real-time predictive ecological inference"
          />

          <Text style={styles.statusDetail}>
            {classifying
              ? 'BioLens is analyzing diatom morphology, ecological tolerance signatures, and pollution-sensitive taxa.'
              : 'Ready for premium AI-based ecological classification.'}
          </Text>
        </GlassCard>

        <AnimatedScanButton
          onPress={handleClassify}
          label="Start BioLens Scan"
          loading={classifying}
          disabled={loading || !image}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  pageTitle: {
    color: colors.primaryDark,
    fontSize: typography.heading2 + 2,
    fontWeight: typography.weightBold,
    letterSpacing: 0.3,
  },

  pageSubtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.body,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },

  dropZone: {
    marginBottom: spacing.lg,
    borderRadius: 30,
    padding: spacing.lg,
  },

  uploadZone: {
    marginTop: spacing.md,
  },

  dashedBorder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 26,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.56)',
  },

  uploadHint: {
    marginTop: spacing.md,
    color: colors.primary,
    textAlign: 'center',
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
  },

  uploadSubHint: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.small,
  },

  previewCard: {
    marginBottom: spacing.lg,
    borderRadius: 30,
    padding: spacing.sm,
  },

  previewImage: {
    width: windowWidth - spacing.lg * 2 - spacing.sm * 2,
    height: 280,
    borderRadius: 26,
    resizeMode: 'cover',
    backgroundColor: colors.surface,
  },

  scanAccent: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: colors.accentDeep,
  },

  scanLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  statusBlock: {
    marginBottom: spacing.lg,
  },

  statusDetail: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
});