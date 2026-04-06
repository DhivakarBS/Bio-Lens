import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ClassificationResult, RootStackParamList } from 'src/types/type';

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

      const response = await axios.get(`${API_URL}/classification/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     setRecords(response.data.records);

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to load history. Please try again.';
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

  const renderHistoryItem = ({ item }: { item: HistoryRecord }) => {
    const result: ClassificationResult = {
      verdict: item.predictedClass,
      waterQualityIndex: item.confidence,
      totalDiatoms: 0,
      speciesBreakdown: {},
      confidenceScores: {},
      recordId: item._id,
      timestamp: item.createdAt,
      className: item.predictedClass,
      confidence: item.confidence,
      scientificDescription: 'Loading...',
      environmentalSignificance: 'Loading...',
      impacts: 'Loading...',
    };

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() =>
          navigation.navigate('Result', {
            result,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemClass}>{item.predictedClass}</Text>
          <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.itemConfidence}>
          <Text style={styles.confidenceValue}>{Math.round(item.confidence * 100)}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Classifications Yet</Text>
      <Text style={styles.emptyText}>
        Start by uploading a microscopic image to see your classification history here.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.emptyButtonText}>Back to Upload</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2d5a3d" />
      </View>
    );
  }
  return (
  <View style={styles.container}>
    <View style={styles.banner}>

  {/* Profile text inside banner */}
  <Text style={styles.bannerTitle}>Classification History</Text>
  <Text style={styles.bannersubtitle}>Your previous classifications</Text>
</View>
   
    {records.length > 0 ? (
      <FlatList
        data={records}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    ) : (
      renderEmptyState()
    )}

    {/* Always show Back to Upload button */}
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={loadHistory}
      >
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.refreshButton, { marginTop: 10, backgroundColor: '#2d5a3d' }]}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.refreshButtonText}>Back to Upload</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2d5a3d',
  },
  itemContent: {
    flex: 1,
  },
  itemClass: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  itemConfidence: {
    backgroundColor: '#e8f0eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5a3d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#2d5a3d',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '60%',
    alignSelf: 'center',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  refreshButton: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    borderRadius: 8,
    width: '60%',
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    
    textAlign: 'center',

  },
  banner: {
  paddingTop: 60,
  paddingBottom: 40,
  alignItems: 'center',
  backgroundColor: '#2d5a3d',   // ✅ green banner
  position: 'relative',
},
bannerTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',                // ✅ white text over green
},

bannersubtitle: {
  fontSize: 14,
  color: '#d0d0d0',
  marginTop: 8,
},
});