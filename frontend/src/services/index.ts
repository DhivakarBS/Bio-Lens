import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  async signup(name: string, email: string, password: string, confirmPassword: string) {
    const response = await api.signup(name, email, password,confirmPassword);
    if (response.token) {
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async login(email: string, password: string) {
    const response = await api.login(email, password);
    if (response.token) {
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
  },

  async getProfile() {
    return await api.getUserProfile();
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  },

  async getStoredUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const adminAuthService = {
  async login(username: string, password: string) {
    const response = await api.adminLogin(username, password);
    if (response.token) {
      await AsyncStorage.setItem('adminToken', response.token);
      await AsyncStorage.setItem('admin', JSON.stringify(response.admin));
    }
    return response;
  },

  async logout() {
    await AsyncStorage.removeItem('adminToken');
    await AsyncStorage.removeItem('admin');
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('adminToken');
    return !!token;
  },

  async getStoredAdmin() {
    const admin = await AsyncStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};

export const classificationService = {
  async classify(imageBase64: string) {
    return await api.classifyImage(imageBase64);
  },

  async getHistory() {
    return await api.getClassificationHistory();
  },

  async getRecord(recordId: string) {
    return await api.getClassificationRecord(recordId);
  },

  async getAllDiatomClasses() {
    return await api.getAllDiatomClasses();
  },
};

export const adminService = {
  async getStats() {
    return await api.getAdminStats();
  },

  async getLogs(page = 1, limit = 20) {
    return await api.getClassificationLogs(page, limit);
  },

  async createDiatomClass(name: string, description: string, significance: string, impacts: string) {
    return await api.createDiatomClass(name, description, significance, impacts);
  },

  async updateDiatomClass(id: string, name: string, description: string, significance: string, impacts: string) {
    return await api.updateDiatomClass(id, name, description, significance, impacts);
  },

  async deleteDiatomClass(id: string) {
    return await api.deleteDiatomClass(id);
  },

  async getAllDiatomClasses() {
    return await api.getAllDiatomClassesAdmin();
  },
};
