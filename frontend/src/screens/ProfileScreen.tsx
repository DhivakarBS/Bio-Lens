import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- TYPES ---
interface User {
  id: string;
  name: string;
  email: string;
}

export default function ProfileScreen({ navigation, setIsAuthenticated }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };
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
  {/* Back button inside banner */}
  <TouchableOpacity 
    style={styles.backButton} 
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back-circle" size={45} color="#fff" />
  </TouchableOpacity>

  {/* Profile text inside banner */}
  <Text style={styles.bannerTitle}>Biolens</Text>
  <Text style={styles.subtitle}>Profile</Text>
</View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>{user?.id?.substring(0, 12) || 'N/A'}...</Text>
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About BioLens</Text>
          <View style={styles.sectionContent}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Application</Text>
              <Text style={styles.aboutValue}>Diatom Detection & Classification</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        {/* <TouchableOpacity
  onPress={() => navigation.navigate('Logout')}
>
  <Text>Logout</Text>
</TouchableOpacity> */}
<TouchableOpacity
  style={styles.logoutButton}
  onPress={async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }}
>
  <Text style={styles.logoutButtonText}>Logout</Text>
</TouchableOpacity>


        <View style={styles.footer}>
          <Text style={styles.footerText}>BioLens © 2026</Text>
          <Text style={styles.footerSubtext}>Research-grade diatom analysis</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 140,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 20,
    
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#2d5a3d',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2d5a3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  aboutItem: {
    padding: 15,
  },
  aboutLabel: {
    color: '#888',
    fontSize: 12,
  },
  aboutValue: {
    fontWeight: '500',
    marginTop: 2,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    opacity: 0.5,
  },
  footerText: {
    fontWeight: 'bold',
  },
  footerSubtext: {
    fontSize: 12,
  },
  logoutButton: {
  backgroundColor: '#d9534f',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 8,
  alignSelf: 'center',
  marginTop: 20,
  width: '60%',           // ✅ expand button width
},
logoutButtonText: {
  color: '#fff',
  fontSize: 16,
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

subtitle: {
  fontSize: 14,
  color: '#d0d0d0',
  marginTop: 8,
},

});