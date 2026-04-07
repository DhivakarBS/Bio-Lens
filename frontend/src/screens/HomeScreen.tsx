import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';

import { User } from '../types/type';
import GlassCard from '../components/GlassCard';
import KPICard from '../components/KPICard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const tiles = useMemo(
    () => [
      {
        title: 'Molecular Accuracy',
        value: '92.7%',
        label: 'AI confidence',
      },
      {
        title: 'Real-time Load',
        value: '14.7k',
        label: 'Processed samples',
      },
      {
        title: 'Ecosystem Impact',
        value: 'LOW',
        label: 'Predicted risk',
      },
    ],
    []
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(650)}
          style={styles.heroCard}
        >
          <View style={styles.heroGlow} />

          <View style={styles.heroText}>
            <Text style={styles.welcome}>Good Afternoon,</Text>
            <Text style={styles.userName}>
              {user?.name || 'Research Lead'}
            </Text>
            <Text style={styles.heroSubtitle}>
              Your BioLens executive dashboard is live. Monitor river health,
              dominant taxa, and ecological risks in real time.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heroAction}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Upload')}
          >
            <Text style={styles.heroActionText}>Launch New Scan</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(120).duration(500)}
          style={styles.row}
        >
          <KPICard
            title="Total Samples"
            value="482"
            label="Historic analysis"
            accent={colors.primary}
          />
          <KPICard
            title="Latest Verdict"
            value="CAUTION"
            label="Corrective advisory"
            accent={colors.caution}
          />
        </Animated.View>

        <GlassCard style={styles.summaryCard}>
          <SectionHeader
            title="Executive Summary"
            subtitle="Latest automatically ingested sample"
          />
          <Text style={styles.summaryBody}>
            BioLens detected 7 dominant diatom taxa and flagged moderate
            nutrient imbalance in the latest river sample. Recommended next
            action: targeted field validation and upstream nutrient source
            mapping.
          </Text>
        </GlassCard>

        <SectionHeader
          title="Performance Metrics"
          subtitle="Key indicators from the last 30 days"
        />

        <View style={styles.metricGrid}>
          {tiles.map((tile, index) => (
            <Animated.View
              key={tile.title}
              entering={FadeInUp.delay(index * 120).duration(500)}
              style={styles.metricAnimated}
            >
              <GlassCard style={styles.metricCard}>
                <Text style={styles.metricTitle}>{tile.title}</Text>
                <Text style={styles.metricValue}>{tile.value}</Text>
                <Text style={styles.metricLabel}>{tile.label}</Text>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

        <SectionHeader
          title="Recent Analysis"
          subtitle="Latest scans and logged verdicts"
        />

        <GlassCard style={styles.timelineCard}>
          {['River sample A', 'Lake inflow', 'Monitoring well 3'].map(
            (item, index) => (
              <Animated.View
                key={item}
                entering={FadeInUp.delay(index * 100).duration(450)}
                style={styles.timelineRow}
              >
                <View style={styles.timelineBullet} />

                <View style={styles.timelineTextBlock}>
                  <Text style={styles.timelineTitle}>{item}</Text>
                  <Text style={styles.timelineSubtitle}>
                    {index === 0
                      ? 'Last 22 minutes ago'
                      : 'Within 48 hours'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    index === 0
                      ? styles.statusSafe
                      : index === 1
                      ? styles.statusCaution
                      : styles.statusUnsafe,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {index === 0
                      ? 'SAFE'
                      : index === 1
                      ? 'CAUTION'
                      : 'UNSAFE'}
                  </Text>
                </View>
              </Animated.View>
            )
          )}
        </GlassCard>

        <GlassCard style={styles.quickPanel}>
          <SectionHeader title="Need an Executive Briefing?" />
          <Text style={styles.quickPanelText}>
            {/* The next scan report can be exported directly to your research
            portfolio and IEEE documentation workflow. */}
          </Text>

          <TouchableOpacity
            style={styles.quickButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.quickButtonText}>Review History</Text>
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  heroCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 34,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',

    shadowColor: '#103f26',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 10,
  },

  heroGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  heroText: {
    marginBottom: spacing.lg,
  },

  welcome: {
    color: colors.primaryDark,
    fontSize: typography.heading2,
    fontWeight: typography.weightBold,
  },

  userName: {
    color: colors.text,
    fontSize: typography.heading1,
    fontWeight: typography.weightBold,
    marginTop: 10,
  },

  heroSubtitle: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },

  heroAction: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  heroActionText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    letterSpacing: 0.4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  summaryCard: {
    marginBottom: spacing.lg,
  },

  summaryBody: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
  },

  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  metricAnimated: {
    width: '48%',
  },

  metricCard: {
    minHeight: 120,
    marginBottom: spacing.sm,
  },

  metricTitle: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginBottom: spacing.xs,
  },

  metricValue: {
    color: colors.primaryDark,
    fontSize: typography.heading3,
    fontWeight: typography.weightBold,
  },

  metricLabel: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.micro,
  },

  timelineCard: {
    marginBottom: spacing.lg,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  timelineBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  timelineTextBlock: {
    flex: 1,
  },

  timelineTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
  },

  timelineSubtitle: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: 4,
  },

  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  statusSafe: {
    backgroundColor: 'rgba(45,143,78,0.14)',
  },

  statusCaution: {
    backgroundColor: 'rgba(240,167,0,0.16)',
  },

  statusUnsafe: {
    backgroundColor: 'rgba(212,62,58,0.16)',
  },

  statusText: {
    color: colors.text,
    fontWeight: typography.weightBold,
    fontSize: typography.small,
  },

  quickPanel: {
    marginBottom: spacing.xxl,
  },

  quickPanelText: {
    color: colors.textMuted,
    fontSize: typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },

  quickButton: {
    backgroundColor: colors.accentDeep,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
  },

  quickButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightBold,
    letterSpacing: 0.4,
  },
});