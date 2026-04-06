import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { RootStackParamList } from 'src/types/type';  // ✅ use your existing definition

// 👇 Composite navigation type for AdminPanel
type AdminPanelNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'AdminDashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;


type Props = {
  navigation: AdminPanelNavigationProp;
};

interface AdminStats {
  totalUsers: number;
  totalClassifications: number;
  totalDiatomClasses: number;
  mostDetectedClasses: Array<{ _id: string; count: number }>;
}

interface DiatomClass {
  _id: string;
  name: string;
  scientificDescription: string;
  environmentalSignificance: string;
  impacts: string;
}

const API_URL = 'http://localhost:5000/api';

export default function AdminPanel({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'stats' | 'classes' | 'logs'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [classes, setClasses] = useState<DiatomClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);

  // New diatom class form
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    scientificDescription: '',
    environmentalSignificance: '',
    impacts: '',
  });

  useFocusEffect(
    useCallback(() => {
      checkAdminAuth();
    }, [])
  );

  const checkAdminAuth = async () => {
    const token = await AsyncStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      setIsAdminAuthenticated(true);
      setShowLoginForm(false);
      loadStats();
    }
  };

  const handleAdminLogin = async () => {
    if (!adminUsername || !adminPassword) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        username: adminUsername,
        password: adminPassword,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('adminToken', response.data.token);
        setAdminToken(response.data.token);
        setIsAdminAuthenticated(true);
        setShowLoginForm(false);
        setAdminUsername('');
        setAdminPassword('');
        loadStats();
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      const response = await axios.get(`${API_URL}/admin/diatom-classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load diatom classes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.scientificDescription) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      await axios.post(`${API_URL}/admin/diatom-classes`, newClass, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Diatom class added successfully');
      setNewClass({
        name: '',
        scientificDescription: '',
        environmentalSignificance: '',
        impacts: '',
      });
      setShowNewClassForm(false);
      loadClasses();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    Alert.alert('Delete Class', 'Are you sure you want to delete this diatom class?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('adminToken');
            if (!token) return;

            await axios.delete(`${API_URL}/admin/diatom-classes/${classId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Success', 'Diatom class deleted');
            loadClasses();
          } catch (error: any) {
            Alert.alert('Error', 'Failed to delete class');
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
    setShowLoginForm(true);
    setAdminToken(null);
  };

  if (showLoginForm) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Admin Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={adminUsername}
            onChangeText={setAdminUsername}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={adminPassword}
            onChangeText={setAdminPassword}
            secureTextEntry
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAdminLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => {
            setActiveTab('stats');
            loadStats();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
          onPress={() => {
            setActiveTab('classes');
            loadClasses();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>
            Diatom Classes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading && activeTab !== 'stats' ? (
          <ActivityIndicator size="large" color="#2d5a3d" />
        ) : activeTab === 'stats' ? (
          <StatsView stats={stats} />
        ) : (
          <ClassesView
            classes={classes}
            onDelete={handleDeleteClass}
            onAddNew={() => setShowNewClassForm(true)}
          />
        )}
      </ScrollView>

      {/* New Class Form Modal */}
      {showNewClassForm && (
        <View style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Diatom Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={newClass.name}
              onChangeText={(text) => setNewClass({ ...newClass, name: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Scientific Description"
              value={newClass.scientificDescription}
              onChangeText={(text) =>
                setNewClass({ ...newClass, scientificDescription: text })
              }
              multiline
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Environmental Significance"
              value={newClass.environmentalSignificance}
              onChangeText={(text) =>
                setNewClass({ ...newClass, environmentalSignificance: text })
              }
              multiline
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Impacts & Indicators"
              value={newClass.impacts}
              onChangeText={(text) => setNewClass({ ...newClass, impacts: text })}
              multiline
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowNewClassForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleAddClass}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Add Class</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function StatsView({ stats }: { stats: AdminStats | null }) {
  if (!stats) {
    return <Text style={styles.emptyText}>No statistics available</Text>;
  }

  return (
    <View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Users</Text>
        <Text style={styles.statValue}>{stats.totalUsers}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Classifications</Text>
        <Text style={styles.statValue}>{stats.totalClassifications}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Diatom Classes</Text>
        <Text style={styles.statValue}>{stats.totalDiatomClasses}</Text>
      </View>

      <Text style={styles.sectionTitle}>Most Detected Classes</Text>
      {stats.mostDetectedClasses.map((item, index) => (
        <View key={index} style={styles.classItem}>
          <Text style={styles.className}>{item._id}</Text>
          <Text style={styles.classCount}>{item.count} detections</Text>
        </View>
      ))}
    </View>
  );
}

function ClassesView({
  classes,
  onDelete,
  onAddNew,
}: {
  classes: DiatomClass[];
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
        <Text style={styles.addButtonText}>+ Add New Class</Text>
      </TouchableOpacity>

      {classes.length === 0 ? (
        <Text style={styles.emptyText}>No diatom classes yet</Text>
      ) : (
        classes.map((diatomClass) => (
          <View key={diatomClass._id} style={styles.classCard}>
            <Text style={styles.classCardTitle}>{diatomClass.name}</Text>
            <Text style={styles.classCardText}>{diatomClass.scientificDescription}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(diatomClass._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  logoutBtn: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2d5a3d',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2d5a3d',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2d5a3d',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d5a3d',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginVertical: 16,
  },
  classItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  classCount: {
    fontSize: 12,
    color: '#666',
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2d5a3d',
  },
  classCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  classCardText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2d5a3d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    flex: 1,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
