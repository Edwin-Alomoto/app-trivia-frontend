import { apiClient } from '../../../../shared/data/services/apiClient';
import { Credentials } from '../../domain/models/Credentials';
import { Tokens } from '../../domain/models/Tokens';
import { UserDto } from '../../domain/models/User';
import { RegisterPayload } from '../../domain/models/Register';

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
  async refresh(refreshToken: string): Promise<Tokens> {
    const res = await apiClient.post<LoginSuccess>('/auth/refresh', { refreshToken }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      expiresIn: res.data.expiresIn,
    };
  },
  async register(payload: RegisterPayload): Promise<{ user: UserDto; tokens: Tokens }> {
    console.log('🔵 [authApi.register] Enviando payload:', JSON.stringify(payload, null, 2));
    const res = await apiClient.post<LoginSuccess>('/auth/register', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('🟢 [authApi.register] Respuesta exitosa:', JSON.stringify(res, null, 2));
    return {
      user: res.data.user,
      tokens: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expiresIn: res.data.expiresIn,
      },
    };
  },
  async logout(refreshToken: string): Promise<void> {
    console.log('🔴 [authApi.logout] Enviando logout con refreshToken');
    await apiClient.post('/auth/logout', { refreshToken }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('🟢 [authApi.logout] Logout exitoso en el servidor');
  },
  async forgotPassword(email: string): Promise<void> {
    console.log('🟠 [authApi.forgotPassword] Enviando solicitud de restablecimiento para:', email);
    await apiClient.post('/auth/forgot-password', { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('🟢 [authApi.forgotPassword] Solicitud enviada exitosamente');
  },
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    console.log('🟣 [authApi.resetPassword] Enviando restablecimiento con token');
    await apiClient.post('/auth/reset-password', { 
      token, 
      newPassword, 
      confirmPassword 
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('🟢 [authApi.resetPassword] Contraseña restablecida exitosamente');
  },
};


