import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';

type RootStackParamList = {
  ProjectInfo: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProjectInfo'
>;

const ProjectInfoScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const workflowSteps = [
    {
      icon: 'camera-outline',
      text: 'Capture microscope images of diatoms',
    },
    {
      icon: 'target',
      text: 'YOLO detects diatom objects in the image',
    },
    {
      icon: 'brain',
      text: 'CNN extracts features for intelligent classification',
    },
    {
      icon: 'chart-line',
      text: 'System predicts environmental conditions',
    },
  ];

  const applications = [
    '🌊 Water Quality Monitoring',
    '🌍 Climate Change Analysis',
    '⚠ Disaster Prediction',
    '🧬 Public Health Early Warning',
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(650)}>
        <Image
          source={require('../../assets/1.png')}
          style={styles.banner}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(650)}>
        <Text style={styles.title}>BioLens Project</Text>
        <Text style={styles.subtitle}>
          Premium AI-Powered Diatom Intelligence Platform
        </Text>
      </Animated.View>

      <GlassCard style={styles.heroCard}>
        <SectionHeader
          title="Executive Overview"
          subtitle="Enterprise-grade environmental intelligence"
        />

        <Text style={styles.bodyText}>
          BioLens is an AI-based environmental monitoring system
          that uses YOLO object detection to identify and analyze diatom species
          from microscopic imagery. The platform automatically
          detects taxa patterns and translates them into reliable
          ecological risk intelligence for proactive water quality
          decision-making.
        </Text>
      </GlassCard>

      <GlassCard style={styles.card}>
        <SectionHeader
          title="AI Workflow Pipeline"
          subtitle="How BioLens transforms images into intelligence"
        />

        {workflowSteps.map((step, index) => (
          <Animated.View
            key={step.text}
            entering={FadeInUp.delay(index * 120).duration(450)}
            style={styles.row}
          >
            <View style={styles.iconCircle}>
              <Icon
                name={step.icon}
                size={22}
                color={colors.primary}
              />
            </View>

            <Text style={styles.workflowText}>{step.text}</Text>
          </Animated.View>
        ))}
      </GlassCard>

      <GlassCard style={styles.card}>
        <SectionHeader
          title="Strategic Applications"
          subtitle="High-impact real-world deployment areas"
        />

        <View style={styles.featureBox}>
          {applications.map((item, index) => (
            <Animated.View
              key={item}
              entering={FadeInUp.delay(index * 100).duration(450)}
            >
              <Text style={styles.feature}>{item}</Text>
            </Animated.View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.highlightCard}>
        <SectionHeader
          title="Why It Matters"
          subtitle="The future of AI-driven environmental diagnostics"
        />

        <Text style={styles.bodyText}>
          By combining diatom ecology with modern computer vision,
          BioLens provides a scalable platform for river health
          monitoring, climate analytics, disaster early warning,
          and research-grade environmental decision support.
        </Text>
      </GlassCard>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>
          Continue to Explore
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 40,
    backgroundColor: colors.background,
  },

  banner: {
    width: '100%',
    height: 210,
    borderRadius: 24,
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: typography.heading2 + 4,
    fontWeight: typography.weightBold,
    textAlign: 'center',
    color: colors.primaryDark,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textMuted,
    fontSize: typography.body,
  },

  heroCard: {
    marginBottom: spacing.lg,
    borderRadius: 28,
  },

  card: {
    marginBottom: spacing.lg,
    borderRadius: 28,
  },

  highlightCard: {
    marginBottom: spacing.lg,
    borderRadius: 28,
  },

  bodyText: {
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(45,90,61,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  workflowText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },

  featureBox: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(45,90,61,0.05)',
    padding: spacing.md,
    borderRadius: 18,
  },

  feature: {
    fontSize: typography.body,
    marginBottom: spacing.sm,
    color: colors.text,
    lineHeight: 22,
  },

  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 24,
    alignItems: 'center',

    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  buttonText: {
    color: '#fff',
    fontWeight: typography.weightBold,
    fontSize: typography.body,
    letterSpacing: 0.4,
  },
});