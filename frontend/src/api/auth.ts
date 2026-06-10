import axiosInstance from './client';
import type { LoginRequest, LoginResponse, User } from '../types';
import type { ApiEnvelope } from '../types/api';

type RegisterResponse = {
  user: User;
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: { email: string; password: string; fullName: string }): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<ApiEnvelope<RegisterResponse>>('/auth/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiEnvelope<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<ApiEnvelope<{ accessToken: string }>>('/auth/refresh');
    return response.data.data;
  },
};
