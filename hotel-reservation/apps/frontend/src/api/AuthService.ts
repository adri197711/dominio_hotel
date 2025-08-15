// src/api/AuthService.ts
import api from './axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const AuthService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};
