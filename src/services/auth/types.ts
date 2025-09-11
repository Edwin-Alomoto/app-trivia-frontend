import { LoginCredentials, RegisterData, User } from '../../types';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  register?(data: RegisterData): Promise<{
    user: User;
    requiresVerification?: boolean;
    token?: string;
  }>;
  logout?(): Promise<void>;
}


