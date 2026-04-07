import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInUp } from 'react-native-reanimated';

import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';
import {
  ClassificationResult,
  RootStackParamList,
} from '../types/type';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'History'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HistoryScreenNavigationProp;
};

interface HistoryRecord {
  _id: string;
  predictedClass: string;
  confidence: number;
  wqi?: number;
  createdAt: string;
}

const API_URL = 'http://localhost:5000/api';

export default function HistoryScreen({ navigation }: Props) {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await axios.get(
        `${API_URL}/classification/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(response.data.records || []);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to load history. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: HistoryRecord;
    index: number;
  }) => {
    const result: ClassificationResult = {
      verdict: item.predictedClass,
      waterQualityIndex: item.wqi || 0,
      totalDiatoms: 0,
      speciesBreakdown: {},
      confidenceScores: { overall: item.confidence },
      recordId: item._id,
      timestamp: item.createdAt,
      className: item.predictedClass,
      confidence: item.confidence,
      scientificDescription: 'N/A',
      environmentalSignificance: 'N/A',
      impacts: 'N/A',
    };

    const verdictColor =
      item.predictedClass === 'SAFE'
        ? colors.success
        : item.predictedClass === 'CAUTION'
        ? colors.caution
        : colors.danger;

    return (
      <Animated.View entering={FadeInUp.delay(index * 80).duration(450)}>
        <TouchableOpacity
          style={styles.historyCard}
          onPress={() => navigation.navigate('Result', { result })}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={styles.thumbnail}>
              <Text style={styles.thumbText}>AI</Text>
            </View>

            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>
                {item.predictedClass}
              </Text>
              <Text style={styles.cardSubtitle}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <View
              style={[
                styles.verdictBadge,
                { backgroundColor: `${verdictColor}18` },
              ]}
            >
              <Text
                style={[
                  styles.verdictText,
                  { color: verdictColor },
                ]}
              >
                {item.predictedClass}
              </Text>
            </View>
          </View>

          <View style={styles.cardMetrics}>
            <GlassCard style={styles.metricPill}>
              <Text style={styles.metricLabel}>WQI</Text>
              <Text style={styles.metricValue}>
                {Math.round(item.wqi || 0)}
              </Text>
            </GlassCard>

            <GlassCard style={styles.metricPill}>
              <Text style={styles.metricLabel}>Confidence</Text>
              <Text style={styles.metricValue}>
                {Math.round(item.confidence * 100)}%
              </Text>
            </GlassCard>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <GlassCard style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <SectionHeader title="No Classifications Yet" />
      <Text style={styles.emptyText}>
        Upload a sample to unlock your executive environmental
        analytics archive.
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.emptyButtonText}>
          Continue to Upload
        </Text>
      </TouchableOpacity>
    </GlassCard>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassCard style={styles.banner}>
        <SectionHeader
          title="Classification History"
          subtitle="Executive scan intelligence archive"
        />
      </GlassCard>

      {records.length > 0 ? (
        <FlashList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          estimatedItemSize={180}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={loadHistory}
        >
          <Text style={styles.footerButtonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, styles.uploadButton]}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text
            style={[
              styles.footerButtonText,
              styles.uploadButtonText,
            ]}
          >
            Upload Sample
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  banner: {
    margin: spacing.md,
    marginBottom: spacing.sm,
  },

  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  historyCard: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 30,
    padding: spacing.lg,
    marginBottom: spacing.md,

    shadowColor: '#103f26',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 7,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  thumbnail: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: colors.accent,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbText: {
    color: '#fff',
    fontWeight: typography.weightBold,
  },

  cardTitleBlock: {
    flex: 1,
  },

  cardTitle: {
    color: colors.primaryDark,
    fontSize: typography.heading4,
    fontWeight: typography.weightBold,
  },

  cardSubtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.small,
  },

  verdictBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  verdictText: {
    fontWeight: typography.weightBold,
    fontSize: typography.small,
  },

  cardMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  metricPill: {
    flex: 1,
    borderRadius: 22,
    padding: spacing.sm,
  },

  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.micro,
    marginBottom: spacing.xs,
  },

  metricValue: {
    color: colors.primaryDark,
    fontSize: typography.heading4,
    fontWeight: typography.weightBold,
  },

  emptyContainer: {
    margin: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },

  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },

  emptyButtonText: {
    color: '#fff',
    fontSize: typography.body,
    fontWeight: typography.weightBold,
  },

  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  footerButton: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  footerButtonText: {
    color: colors.primaryDark,
    fontSize: typography.body,
    fontWeight: typography.weightBold,
  },

  uploadButton: {
    backgroundColor: colors.primary,
  },

  uploadButtonText: {
    color: '#fff',
  },
});