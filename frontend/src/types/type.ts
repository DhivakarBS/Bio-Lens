// User related types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Diatom classification types
export interface DiatomClass {
  _id: string;
  name: string;
  scientificDescription: string;
  environmentalSignificance: string;
  impacts: string;
}

export interface ClassificationResult {
  // Core scores returned from backend ML service
  verdict: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'NO DATA' | string;
  waterQualityIndex: number;
  totalDiatoms: number;
  speciesBreakdown: Record<string, number>;
  confidenceScores: Record<string, number>;
  recordId: string;
  timestamp: string;

  // Optional legacy fields used in history preview / class-specific info mode
  className?: string;
  confidence?: number;
  scientificDescription?: string;
  environmentalSignificance?: string;
  impacts?: string;
}

export interface ClassificationRecord {
  _id: string;
  userId: string;
  imageUrl: string;
  predictedClass: string;
  confidence: number;
  createdAt: string;
  diatomClass?: DiatomClass;
}

// Admin types
export interface Admin {
  id: string;
  username: string;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminStats {
  totalUsers: number;
  totalClassifications: number;
  totalDiatomClasses: number;
  mostDetectedClasses: {
    _id: string;
    count: number;
    avgConfidence: number;
  }[];
  recentClassifications: ClassificationRecord[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user?: User | Admin;
  admin?: Admin;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Upload: undefined;
  Logout: undefined;
  Result: { result: ClassificationResult };
  History: undefined;
  Profile: undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  UserTabs: undefined;
  ProjectInfo: undefined;
};