import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/types/type';

// Import ALL screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

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
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProjectInfo" component={ProjectInfoScreen} />
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name= "Result" component={ResultScreen}/>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}