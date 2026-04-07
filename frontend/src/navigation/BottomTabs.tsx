import React, { useEffect } from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, spacing, typography } from '../theme';

const Tab = createBottomTabNavigator();

function TabButton(props: BottomTabBarButtonProps) {
  const { accessibilityState, children, onPress } = props;
  const focused = accessibilityState?.selected ?? false;

  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.08 : 1, {
      damping: 14,
      stiffness: 180,
    });

    lift.value = withTiming(focused ? -4 : 0, {
      duration: 220,
    });
  }, [focused, scale, lift]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: lift.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.tabButton, animatedStyle as any]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.tabTouch}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<
            string,
            keyof typeof Ionicons.glyphMap
          > = {
            Home: 'home',
            Upload: 'scan',
            History: 'time',
            Profile: 'person-circle',
          };

          return (
            <Ionicons
              name={iconMap[route.name] || 'ellipse'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    height: 78,
    borderRadius: 40,

    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(45,90,61,0.10)',

    shadowColor: '#103f26',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 14,

    paddingHorizontal: spacing.md,
    paddingTop: 6,
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: typography.weightBold,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  tabButton: {
    flex: 1,
  },

  tabTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});