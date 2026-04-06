import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { colors, spacing, typography } from '../theme';

interface AnimatedScanButtonProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AnimatedScanButton({
  onPress,
  label,
  disabled,
  loading,
}: AnimatedScanButtonProps) {
  const pulse = useSharedValue(1);
  const glow = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.04, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    glow.value = withRepeat(
      withTiming(1, {
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(glow.value, [0, 1], [0.18, 0.32]);
    const shadowRadius = interpolate(glow.value, [0, 1], [18, 30]);

    return {
      transform: [{ scale: pulse.value * pressScale.value }],
      opacity: disabled ? 0.65 : 1,
      shadowOpacity,
      shadowRadius,
    };
  });

  const handlePressIn = () => {
    pressScale.value = withSpring(0.96, {
      damping: 12,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  return (
    <AnimatedTouchable
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.innerGlow} />
      <Text style={styles.label}>
        {loading ? 'AI Analyzing Sample...' : label}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: spacing.lg + 2,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },

  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 26,
  },

  label: {
    color: '#FFFFFF',
    fontSize: typography.body + 1,
    fontWeight: typography.weightBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});