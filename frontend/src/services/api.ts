import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

interface AxiosErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use(
      async (config: any) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Handle responses
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError<AxiosErrorResponse>) => {
        if (error.response?.status === 401) {
          AsyncStorage.removeItem('userToken');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
 async signup(name: string, email: string, password: string, confirmPassword: string) {
  const response = await this.client.post('/auth/signup', {
    name,
    email,
    password,
    confirmPassword,
  });
  return response.data;
}



  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async getUserProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Classification endpoints
  async classifyImage(imageBase64: string) {
    const response = await this.client.post('/classification/classify', { imageBase64 });
    return response.data;
  }

  async getClassificationHistory() {
    const response = await this.client.get('/classification/history');
    return response.data;
  }

  async getClassificationRecord(recordId: string) {
    const response = await this.client.get(`/classification/${recordId}`);
    return response.data;
  }

  async getAllDiatomClasses() {
    const response = await this.client.get('/classification/classes/all');
    return response.data;
  }

  // Admin endpoints
  async adminLogin(username: string, password: string) {
    const response = await this.client.post('/admin/login', { username, password });
    return response.data;
  }

  async getAdminStats() {
    const response = await this.client.get('/admin/stats');
    return response.data;
  }

  async getClassificationLogs(page = 1, limit = 20) {
    const response = await this.client.get('/admin/logs', { params: { page, limit } });
    return response.data;
  }

  async createDiatomClass(name: string, scientificDescription: string, environmentalSignificance: string, impacts: string) {
    const response = await this.client.post('/admin/diatom-classes', {
      name,
      scientificDescription,
      environmentalSignificance,
      impacts,
    });
    return response.data;
  }

  async updateDiatomClass(classId: string, name: string, scientificDescription: string, environmentalSignificance: string, impacts: string) {
    const response = await this.client.put(`/admin/diatom-classes/${classId}`, {
      name,
      scientificDescription,
      environmentalSignificance,
      impacts,
    });
    return response.data;
  }

  async deleteDiatomClass(classId: string) {
    const response = await this.client.delete(`/admin/diatom-classes/${classId}`);
    return response.data;
  }

  async getAllDiatomClassesAdmin() {
    const response = await this.client.get('/admin/diatom-classes');
    return response.data;
  }
}

export default new ApiClient();
