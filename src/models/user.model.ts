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
  role: string;
  phone?: string;
  birthDate?: string;
  address?: string;
}


export interface AuthResponse {
  success: boolean;
  data?: User;
  token?: string;
  message?: string;
}

export interface Testimonial {
  id?: number;
  name: string;
  subtitle: string;
  content: string;
  createdAt?: Date;
}
