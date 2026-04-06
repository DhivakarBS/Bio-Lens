import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authService } from 'src/services';
import { RootStackParamList } from 'src/types/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupScreen({ navigation }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
const [successDialog, setSuccessDialog] = useState(false);
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.signup(
  formData.name,
  formData.email,
  formData.password,
  formData.confirmPassword  
);


      if (response && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setSuccessDialog(true);
        navigation.replace('ProjectInfo');
      } else if (response && response.message) {
        Alert.alert('Signup Failed', response.message);
      } else {
        Alert.alert('Signup Failed', 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        'An error occurred during signup';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join BioLens</Text>
      </View>
    {successDialog && (
  <View style={styles.dialogOverlay}>
    <View style={styles.dialogBox}>
      <Text style={styles.dialogText}>Signed up successfully</Text>
      <TouchableOpacity 
        style={styles.dialogButton} 
        onPress={() => setSuccessDialog(false)}
      >
        <Text style={styles.dialogButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          editable={!isLoading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          editable={!isLoading}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          editable={!isLoading}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          editable={!isLoading}
          secureTextEntry
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#2d5a3d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#d0d0d0',
    marginTop: 8,
  },
  form: {
  padding: 24,
  maxWidth: 600,   // ✅ limit width on larger screens
  alignSelf: 'center', // ✅ center the form horizontally
  width: '100%',    // ✅ ensure it takes full width of its container
},
input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  fontSize: 14,
  color: '#333',
  backgroundColor: '#f9f9f9',
  width: '100%',   // ✅ fill only the form container, not the whole screen
},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2d5a3d',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: '600',
    color: '#2d5a3d',
  },
dialogOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '#2d5a3d',
  padding: 12,
  alignItems: 'center',
},
dialogBox: {
  backgroundColor: 'transparent', // banner style
},
dialogText: {
  color: '#fff',
  fontWeight: '600',
},

dialogButton: {
  backgroundColor: '#2d5a3d',
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
},

dialogButtonText: {
  color: '#fff',
  fontWeight: '600',
},

});