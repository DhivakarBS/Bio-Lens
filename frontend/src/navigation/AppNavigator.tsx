import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/types/type';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Import ALL screens
import BottomTabs from './BottomTabs';
import LoginScreen from '../screens/LoginScreen';
import MainHome from '../screens/MainHome';
import HistoryScreen from 'src/screens/HistoryScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import ResultScreen from 'src/screens/ResultScreen';
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import ProjectInfoScreen from '../screens/ProjectInfoScreen';
import SignupScreen from '../screens/SignupScreen';
import UploadScreen from '../screens/UploadScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={BottomTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="MainHome" component={MainHome} />
      <Stack.Screen 
        name="ProjectInfo" 
        component={ProjectInfoScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Project Info',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Upload')} style={{ marginRight: 16 }}>
              <Ionicons name="scan" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Upload',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('History')} style={{ marginRight: 16 }}>
              <Ionicons name="time" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Result',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16 }}>
              <TouchableOpacity onPress={() => navigation.navigate('History')} style={{ marginRight: 16 }}>
                <Ionicons name="time" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
                <Ionicons name="scan" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}