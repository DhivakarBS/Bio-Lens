import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import Animated, { FadeInUp } from 'react-native-reanimated';

import GlassCard from '../components/GlassCard';
import KPICard from '../components/KPICard';
import SectionHeader from '../components/SectionHeader';
import VerdictBanner from '../components/VerdictBanner';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const screenWidth = Dimensions.get('window').width - 48;

export default function ResultScreen({ navigation, route }: Props) {
  const { result } = route.params;

  const displayVerdict = result.verdict || 'NO DATA';
  const waterQualityIndex =
    typeof result.waterQualityIndex === 'number'
      ? result.waterQualityIndex
      : 0;

  const speciesBreakdown = result.speciesBreakdown || {};
  const confidenceScores = result.confidenceScores || {};
  const normalizedWQI = Math.min(
    Math.max(waterQualityIndex / 100, 0),
    1
  );
  const speciesEntries = Object.entries(speciesBreakdown);

const dominantSpecies =
  speciesEntries.length > 0
    ? speciesEntries.reduce((max, current) =>
        Number(current[1]) > Number(max[1]) ? current : max
      )[0]
    : 'Unknown';
  const totalSpeciesCount = speciesEntries.reduce(
  (sum, [, count]) => sum + Number(count),
  0
);

const dominantCount =
  speciesEntries.length > 0
    ? Number(
        speciesEntries.reduce((max, current) =>
          Number(current[1]) > Number(max[1]) ? current : max
        )[1]
      )
    : 0;

const derivedConfidence =
  totalSpeciesCount > 0
    ? Math.round((dominantCount / totalSpeciesCount) * 100)
    : 0;

  const speciesChart = Object.entries(speciesBreakdown).map(
    ([name, count], index) => ({
      name,
      population: Number(count),
      color: [
        colors.primary,
        colors.accentDeep,
        colors.caution,
        colors.danger,
        '#4CAF50',
        '#9E9E9E',
      ][index % 6],
      legendFontColor: colors.textMuted,
      legendFontSize: 12,
    })
  );

  const riskColor =
    displayVerdict === 'SAFE'
      ? colors.success
      : displayVerdict === 'CAUTION'
      ? colors.caution
      : colors.danger;

  const verdictSuggestions: Record<string, string[]> = {
    SAFE: [
      'Maintain monthly monitoring schedule.',
      'Preserve surrounding vegetation buffer zones.',
      'Continue low-impact ecological management.',
    ],
    CAUTION: [
      'Increase sampling frequency in nearby sites.',
      'Inspect upstream nutrient or sewage inflow.',
      'Validate pH and conductivity within 48 hours.',
    ],
    UNSAFE: [
      'Immediate field inspection is recommended.',
      'Check for industrial discharge or contamination.',
      'Deploy rapid mitigation and notify authorities.',
    ],
    'NO DATA': [
      'Insufficient data for recommendation.',
      'Run another scan with clearer microscopy image.',
    ],
  };

  const recommendations =
    verdictSuggestions[displayVerdict] ||
    verdictSuggestions['NO DATA'];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <VerdictBanner
        verdict={displayVerdict}
        subtext="BioLens AI classification complete. Review the ecological intelligence dashboard and recommended mitigation workflow."
      />

      <View style={styles.dashboardRow}>
        <View style={styles.sideColumn}>
          <KPICard
            title="WQI"
            value={waterQualityIndex.toFixed(1)}
            label="Water Quality Index"
            accent={colors.primary}
          />

          <KPICard
            title="Dominant"
            value={dominantSpecies}
            label="Top species"
            accent={colors.caution}
          />
        </View>

        <GlassCard style={styles.centerChartCard}>
          <SectionHeader
            title="Species Breakdown"
            subtitle="Diatom distribution"
          />

          {speciesChart.length > 0 ? (
            <>
             <View style={styles.chartContainer}>
              <PieChart
                data={speciesChart}
                width={300}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="40"
                absolute
                hasLegend={false}
              />
            </View>

              <View style={styles.legendWrapper}>
                {speciesChart.map((item) => (
                  <View key={item.name} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendText}>
                      {item.name}: {item.population}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.naText}>No species data</Text>
          )}
        </GlassCard>

        <View style={styles.sideColumn}>
          <KPICard
            title="Confidence"
            value={`${derivedConfidence}%`}
            label="Dominance strength"
            accent={colors.accentDeep}
          />

          <KPICard
            title="Risk"
            value={displayVerdict}
            label="Operational priority"
            accent={riskColor}
          />
        </View>
      </View>

      {/* <GlassCard style={styles.progressCard}>
        <SectionHeader
          title="Ecological Health Meter"
          subtitle="Normalized ecosystem performance"
        />

        <ProgressChart
          data={{ data: [normalizedWQI] }}
          width={screenWidth}
          height={180}
          strokeWidth={14}
          radius={54}
          chartConfig={chartConfig}
          hideLegend
        />

        <Text style={styles.qualityText}>
          {`${Math.round(
            normalizedWQI * 100
          )}% of ideal ecosystem score`}
        </Text>
      </GlassCard> */}

      <SectionHeader
        title="Recommended Actions"
        subtitle="AI-driven environmental advisory"
      />

      {recommendations.map((tip, index) => (
        <Animated.View
          key={tip}
          entering={FadeInUp.delay(index * 80).duration(450)}
        >
          <GlassCard style={styles.insightCard}>
            <Text style={styles.recommendationText}>
              • {tip}
            </Text>
          </GlassCard>
        </Animated.View>
      ))}

      <View style={styles.actionGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.primaryButtonText}>
            Review Full History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text style={styles.secondaryButtonText}>
            Run New Scan
          </Text>
        </TouchableOpacity>
      </View>

      <GlassCard style={styles.metaCard}>
        <SectionHeader title="Record Metadata" />

        <Text style={styles.metaLabel}>Record ID</Text>
        <Text style={styles.metaValue}>
          {result.recordId || 'N/A'}
        </Text>

        <Text style={styles.metaLabel}>Timestamp</Text>
        <Text style={styles.metaValue}>
          {result.timestamp || 'N/A'}
        </Text>
      </GlassCard>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(45, 90, 61, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(47, 67, 54, ${opacity})`,
  strokeWidth: 2,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  dashboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },

  sideColumn: {
    width: 160,
    justifyContent: 'space-between',
    gap: spacing.lg,
  },

  centerChartCard: {
    width: 420,
    minHeight: 380,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

 chartContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: spacing.sm,
  paddingLeft: 20,
},

  legendWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: typography.small,
    color: colors.textMuted,
  },

  naText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },

  progressCard: {
    marginBottom: spacing.lg,
  },

  qualityText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
  },

  insightCard: {
    marginBottom: spacing.sm,
  },

  recommendationText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 24,
  },

  actionGroup: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightBold,
  },

  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: typography.weightBold,
  },

  metaCard: {
    marginTop: spacing.lg,
  },

  metaLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: spacing.sm,
  },

  metaValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
  },
});