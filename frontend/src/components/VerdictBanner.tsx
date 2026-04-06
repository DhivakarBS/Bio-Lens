import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, typography } from '../theme';

interface VerdictBannerProps {
  verdict: string;
  subtext?: string;
}

const verdictConfig: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  SAFE: {
    label: 'Safe',
    color: colors.success,
    glow: 'rgba(34,197,94,0.08)',
  },
  CAUTION: {
    label: 'Caution',
    color: colors.caution,
    glow: 'rgba(245,158,11,0.08)',
  },
  UNSAFE: {
    label: 'Unsafe',
    color: colors.danger,
    glow: 'rgba(239,68,68,0.08)',
  },
  'NO DATA': {
    label: 'No Data',
    color: colors.textMuted,
    glow: 'rgba(148,163,184,0.06)',
  },
};

export default function VerdictBanner({
  verdict,
  subtext,
}: VerdictBannerProps) {
  const config = verdictConfig[verdict] || verdictConfig['NO DATA'];

  return (
    <Animated.View
      entering={FadeInDown.duration(650)}
      style={[
        styles.banner,
        {
          borderColor: config.color,
          shadowColor: config.color,
          backgroundColor: config.glow,
        },
      ]}
    >
      <View style={styles.topGlow} />

      <View
        style={[
          styles.badge,
          {
            backgroundColor: `${config.color}18`,
            borderColor: `${config.color}30`,
          },
        ]}
      >
        <Text style={[styles.badgeText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>

      <Text style={styles.heading}>{config.label} Water Quality</Text>

      <Text style={styles.description} numberOfLines={3}>
        {subtext ||
          'BioLens AI indicates a highly reliable ecological assessment based on diatom sensitivity patterns and environmental stability metrics.'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    borderWidth: 1.2,
    borderRadius: 28,
    padding: spacing.lg + 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',

    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 7,
  },

  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: typography.small,
    fontWeight: typography.weightBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  heading: {
    fontSize: typography.heading2 + 2,
    fontWeight: typography.weightBold,
    marginBottom: spacing.xs,
    color: colors.text,
    letterSpacing: 0.2,
  },

  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});