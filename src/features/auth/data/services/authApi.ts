import { apiClient } from '../../../../shared/data/services/apiClient';
import { Credentials } from '../../domain/models/Credentials';
import { Tokens } from '../../domain/models/Tokens';
import { UserDto } from '../../domain/models/User';

type LoginSuccess = {
  status: number;
  message: string;
  data: {
    user: UserDto;
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  };
  timestamp: string;
};

export const authApi = {
  async login(credentials: Credentials): Promise<{ user: UserDto; tokens: Tokens }> {
    const res = await apiClient.post<LoginSuccess>('/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
    return {
      user: res.data.user,
      tokens: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      },
    };
  },
};


