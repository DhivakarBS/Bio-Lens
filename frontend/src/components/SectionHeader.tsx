import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(550)}
      style={styles.headerContainer}
    >
      <View style={styles.titleRow}>
        <View style={styles.accentBar} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: spacing.md + 2,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  accentBar: {
    width: 5,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: typography.heading3 + 2,
    fontWeight: typography.weightBold,
    color: colors.text,
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 6,
    marginLeft: spacing.sm + 5,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
});