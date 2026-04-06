import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, shadows, spacing, typography } from '../theme';

interface KPICardProps {
  title: string;
  value: string | number;
  label?: string;
  accent?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function KPICard({
  title,
  value,
  label,
  accent,
}: KPICardProps) {
  const scale = useSharedValue(0.96);

  scale.value = withTiming(1, { duration: 700 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 1,
  }));

  return (
    <AnimatedView
      entering={FadeInUp.duration(650)}
      style={[
        styles.card,
        animatedStyle,
        accent ? { borderColor: accent } : {},
      ]}
    >
      <View style={styles.glowOverlay} />

      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.value, accent ? { color: accent } : {}]}>
        {value}
      </Text>

      {label ? <Text style={styles.label}>{label}</Text> : null}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    minHeight: 120,
    backgroundColor: colors.surfaceGlass || 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 28,
    padding: spacing.md + 2,
    justifyContent: 'space-between',
    overflow: 'hidden',

    shadowColor: '#103f26',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 7,

    ...shadows.card,
  },

  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  title: {
    fontSize: typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontWeight: typography.weightSemiBold,
    letterSpacing: 0.3,
  },

  value: {
    fontSize: typography.heading3 + 2,
    color: colors.text,
    fontWeight: typography.weightBold,
    letterSpacing: 0.2,
  },

  label: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.micro,
    lineHeight: 18,
  },
});