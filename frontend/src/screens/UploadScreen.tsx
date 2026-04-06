import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import api from 'src/services/api';
import { RootStackParamList } from 'src/types/type';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

export default function UploadScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to upload images'
        );
      }
    })();
  }, []);

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      setLoading(true);

      let result;

      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets?.[0]) {
        const uri = result.assets[0].uri;
        const base64 = await convertImageToBase64(uri);
        setImage(base64);
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setLoading(false);
    }
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleClassify = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    try {
      setClassifying(true);

      console.log(
        'UploadScreen: sending classify request, image size:',
        image.length
      );

      const response = await api.classifyImage(image);

      console.log('FULL BACKEND RESPONSE:', response);

      if (response?.success) {
        navigation.navigate('Result', {
          result: response.classification,
        });

        setImage(null);
        return;
      }

      Alert.alert(
        'Prediction Failed',
        response?.message || 'Could not classify image'
      );
    } catch (error: any) {
      console.error('FULL BACKEND ERROR:', error?.response?.data);
      console.error('UploadScreen.handleClassify error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Classification failed. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setClassifying(false);
    }
  };

  return (
    <View style={styles.container1}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#2d5a3d" />
        </TouchableOpacity>

        <Text style={styles.title}>BioLens</Text>
        <Text style={styles.subtitle}>Upload & Classification</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={35} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topImageWrapper}>
          <Image
            source={require('../../assets/output.jpeg')}
            style={styles.image}
          />
        </View>

        <Text style={styles.uploadTitle}>Upload your image</Text>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickImage('gallery')}
          disabled={loading || classifying}
        >
          <Text style={styles.uploadText}>
            {loading ? 'Loading...' : 'Click to upload'}
          </Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.previewContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setImage(null)}
            >
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              style={styles.preview}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.predictCircle}
          onPress={handleClassify}
          disabled={classifying || !image}
        >
          <Text style={styles.predictText}>
            {classifying ? 'Processing...' : `Start\nPredicting`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#2d5a3d',
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#d0d0d0',
    marginTop: 8,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 2,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  historyButton: {
    position: 'absolute',
    top: 20,
    right: 70,
  },
  uploadBtn: {
    backgroundColor: '#0b6e3b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  cancelBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '700',
  },
  predictCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0b6e3b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: '#8fe0b0',
  },
  predictText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  topImageWrapper: {
    width: 240,
    height: 240,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});