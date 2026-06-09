import axiosInstance from './client';
import type { LoginRequest, LoginResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: { email: string; password: string; name: string }): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await axiosInstance.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};
