import client from './client';
import { User } from '../types/auth';

interface AuthResponse {
  success: boolean;
  data: { token: string; user: User };
}

interface MeResponse {
  success: boolean;
  data: { user: User };
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    client.post<AuthResponse>('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    client.post<AuthResponse>('/auth/login', { email, password }),

  getMe: () => client.get<MeResponse>('/auth/me'),
};
