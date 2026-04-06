import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Animated, { FadeInUp } from 'react-native-reanimated';

import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types/type';

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
  const [activeTab, setActiveTab] =
    useState<'stats' | 'classes'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [classes, setClasses] = useState<DiatomClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showNewClassForm, setShowNewClassForm] =
    useState(false);

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
        await AsyncStorage.setItem(
          'adminToken',
          response.data.token
        );

        setShowLoginForm(false);
        setAdminUsername('');
        setAdminPassword('');
        loadStats();
      }
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials'
      );
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
    } catch {
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

      const response = await axios.get(
        `${API_URL}/admin/diatom-classes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClasses(response.data);
    } catch {
      Alert.alert('Error', 'Failed to load diatom classes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.scientificDescription) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      await axios.post(
        `${API_URL}/admin/diatom-classes`,
        newClass,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to add class'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this diatom class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(
                'adminToken'
              );
              if (!token) return;

              await axios.delete(
                `${API_URL}/admin/diatom-classes/${classId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              loadClasses();
            } catch {
              Alert.alert('Error', 'Failed to delete class');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminToken');
    setShowLoginForm(true);
  };

  if (showLoginForm) {
    return (
      <View style={styles.container}>
        <GlassCard style={styles.loginContainer}>
          <SectionHeader
            title="Admin Login"
            subtitle="Secure BioLens control center"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={adminUsername}
            onChangeText={setAdminUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={adminPassword}
            onChangeText={setAdminPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdminLogin}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Access Dashboard</Text>
            )}
          </TouchableOpacity>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassCard style={styles.header}>
        <SectionHeader
          title="Admin Dashboard"
          subtitle="Enterprise BioLens control center"
        />

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </GlassCard>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'stats' && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab('stats');
            loadStats();
          }}
        >
          <Text style={styles.activeTabText}>Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'classes' && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab('classes');
            loadClasses();
          }}
        >
          <Text style={styles.activeTabText}>Diatom Classes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
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

      {showNewClassForm && (
        <View style={styles.formOverlay}>
          <GlassCard style={styles.formContainer}>
            <SectionHeader title="Add New Diatom Class" />

            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={newClass.name}
              onChangeText={(text) =>
                setNewClass({ ...newClass, name: text })
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Scientific Description"
              value={newClass.scientificDescription}
              onChangeText={(text) =>
                setNewClass({
                  ...newClass,
                  scientificDescription: text,
                })
              }
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
                style={styles.button}
                onPress={handleAddClass}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
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
    <Animated.View entering={FadeInUp.duration(500)}>
      <GlassCard style={styles.statCard}>
        <Text style={styles.statLabel}>Total Users</Text>
        <Text style={styles.statValue}>{stats.totalUsers}</Text>
      </GlassCard>

      <GlassCard style={styles.statCard}>
        <Text style={styles.statLabel}>Total Classifications</Text>
        <Text style={styles.statValue}>
          {stats.totalClassifications}
        </Text>
      </GlassCard>

      <GlassCard style={styles.statCard}>
        <Text style={styles.statLabel}>Diatom Classes</Text>
        <Text style={styles.statValue}>
          {stats.totalDiatomClasses}
        </Text>
      </GlassCard>
    </Animated.View>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddNew}
      >
        <Text style={styles.addButtonText}>+ Add New Class</Text>
      </TouchableOpacity>

      {classes.map((diatomClass) => (
        <GlassCard
          key={diatomClass._id}
          style={styles.classCard}
        >
          <Text style={styles.classCardTitle}>
            {diatomClass.name}
          </Text>
          <Text style={styles.classCardText}>
            {diatomClass.scientificDescription}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(diatomClass._id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },

  header: {
    marginBottom: spacing.md,
  },

  loginContainer: {
    marginTop: 120,
  },

  tabContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surfaceGlass,
    alignItems: 'center',
  },

  activeTab: {
    borderWidth: 1,
    borderColor: colors.primary,
  },

  activeTabText: {
    color: colors.primaryDark,
    fontWeight: typography.weightBold,
  },

  contentContainer: {
    paddingBottom: spacing.xxl,
  },

  statCard: {
    marginBottom: spacing.md,
  },

  statLabel: {
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  statValue: {
    color: colors.primaryDark,
    fontSize: typography.heading2,
    fontWeight: typography.weightBold,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: typography.weightBold,
  },

  classCard: {
    marginBottom: spacing.md,
  },

  classCardTitle: {
    fontSize: typography.heading4,
    fontWeight: typography.weightBold,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },

  classCardText: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  deleteButton: {
    backgroundColor: 'rgba(255,0,0,0.08)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },

  deleteButtonText: {
    color: colors.danger,
    fontWeight: typography.weightBold,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: 18,
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: typography.weightBold,
  },

  logoutBtn: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },

  logoutBtnText: {
    color: '#fff',
    fontWeight: typography.weightBold,
  },

  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginVertical: spacing.xl,
  },

  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  formContainer: {},

  formButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  cancelButtonText: {
    color: colors.text,
    fontWeight: typography.weightBold,
  },
});