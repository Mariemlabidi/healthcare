export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'client' | 'medecin' | 'admin'; 
  phone?: string; // Optionnel
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: 'client' | 'medecin' | 'admin'; 
}

export interface AuthResponse {
  success: boolean;
  data?: User;
  token?: string;
  message?: string;
}