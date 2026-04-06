import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from 'src/types/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: Props) {
  const { result } = route.params;

  // New ML response schema normalized
  const displayVerdict = result.verdict || 'NO DATA';
  const verdictColor =
    displayVerdict === 'SAFE'
      ? '#2d8f4e'
      : displayVerdict === 'CAUTION'
      ? '#f0ad4e'
      : displayVerdict === 'UNSAFE'
      ? '#dc3545'
      : '#6c757d';

  const waterQualityIndex =
    result.waterQualityIndex !== undefined && result.waterQualityIndex !== null
      ? result.waterQualityIndex
      : 'N/A';

  const totalDiatoms =
    result.totalDiatoms !== undefined && result.totalDiatoms !== null
      ? result.totalDiatoms
      : 'N/A';

  const speciesBreakdown: Record<string, number> =
    result.speciesBreakdown && typeof result.speciesBreakdown === 'object'
      ? result.speciesBreakdown
      : {};

  const confidenceScores: Record<string, number> =
    result.confidenceScores && typeof result.confidenceScores === 'object'
      ? result.confidenceScores
      : {};

  const recordId = result.recordId || 'N/A';
  const timestamp = result.timestamp || 'N/A';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>BioLens Water Quality Report</Text>
      </View>

      {/* Verdict Card */}
      <View style={[styles.verdictCard, { borderLeftColor: verdictColor }]}>
        <Text style={[styles.verdictText, { color: verdictColor }]}>
          {displayVerdict}
        </Text>
        <Text style={styles.wqiText}>
          WQI: {waterQualityIndex}
        </Text>
        <Text style={styles.totalText}>
          Total Diatoms: {totalDiatoms}
        </Text>
      </View>

      {/* Species Breakdown */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Species Breakdown</Text>

        {Object.entries(speciesBreakdown).map(([species, count]) => (
          <View key={species} style={styles.speciesRow}>
            <Text style={styles.speciesName}>{species}</Text>
            <Text style={styles.speciesCount}>{String(count)}</Text>
          </View>
        ))}
      </View>

      {/* Confidence Scores */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Average AI Confidence</Text>

        {Object.entries(confidenceScores).map(([species, score]) => (
          <View key={species} style={styles.speciesRow}>
            <Text style={styles.speciesName}>{species}</Text>
            <Text style={styles.speciesCount}>
              {(Number(score) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.primaryButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text style={styles.secondaryButtonText}>Analyze Another Sample</Text>
        </TouchableOpacity>
      </View>

      {/* Record Info */}
      <View style={styles.recordInfo}>
        <Text style={styles.recordLabel}>Record ID</Text>
        <Text style={styles.recordId}>{result.recordId}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  verdictCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
  },
  verdictText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  wqiText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  totalText: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1a1a1a',
  },
  speciesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  speciesName: {
    fontSize: 15,
    color: '#333',
  },
  speciesCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d5a3d',
  },
  actionGroup: {
    gap: 12,
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e8f0eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d5a3d',
  },
  secondaryButtonText: {
    color: '#2d5a3d',
    fontSize: 16,
    fontWeight: '600',
  },
  recordInfo: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  recordLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  recordId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});