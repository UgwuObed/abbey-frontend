import api from './api';
import { User, LoginResponse, RegisterData, RegisterResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

async register(userData: RegisterData): Promise<RegisterResponse> {
  const response = await api.post('/auth/register', userData);
  return response.data;
},

async getProfile(): Promise<{ status: string; message: string; data: User }> {
  const response = await api.get('/auth/profile');
  return response.data;
},

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};
