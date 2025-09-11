import * as SecureStore from 'expo-secure-store';

import { IAuthService } from './types';
import { LoginCredentials, RegisterData, User } from '../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class HttpAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(700);

    if (credentials.password !== '12345678') {
      throw new Error('Email o contraseña incorrectos.');
    }

    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'Usuario Demo',
      alias: 'trivia_master',
      points: 0,
      createdAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        language: 'es',
        sound: true,
        haptics: true,
      },
      subscriptionStatus: 'not_subscribed',
    };

    const token = 'mock_jwt_token_' + Date.now();

    await SecureStore.setItemAsync('auth_token', token);
    await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));

    return { user: mockUser, token };
  }

  async register(data: RegisterData): Promise<{ user: User; requiresVerification: boolean }> {
    await delay(1500);

    const mockUser: User = {
      id: '1',
      email: data.email,
      name: data.name ?? data.email.split('@')[0],
      alias: data.alias ?? data.email.split('@')[0],
      points: 0,
      createdAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        language: 'es',
        sound: true,
        haptics: true,
      },
      subscriptionStatus: 'not_subscribed',
    };

    return { user: mockUser, requiresVerification: true };
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
  }
}


