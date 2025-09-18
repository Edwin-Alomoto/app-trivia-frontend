import { authApi } from '../services/authApi';
import { tokenStorage } from '../../../../shared/data/services/tokenStorage';
import { Credentials } from '../../domain/models/Credentials';

export const AuthRepository = {
  async login(credentials: Credentials) {
    const { user, tokens } = await authApi.login(credentials);
    await tokenStorage.save(tokens.accessToken, tokens.refreshToken, user);
    // Actualizar apiClient tokens en memoria si es necesario
    try {
      const { apiClient } = await import('../../../../shared/data/services/apiClient');
      await apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    } catch {}
    return { user, tokens };
  },
  async logout() {
    await tokenStorage.clear();
    try {
      const { apiClient } = await import('../../../../shared/data/services/apiClient');
      await apiClient.setTokens(null, null);
    } catch {}
  },
  async refresh() {
    const { refreshToken } = await tokenStorage.load();
    if (!refreshToken) throw new Error('No hay refresh token');
    const tokens = await authApi.refresh(refreshToken);
    await tokenStorage.save(tokens.accessToken, tokens.refreshToken);
    try {
      const { apiClient } = await import('../../../../shared/data/services/apiClient');
      await apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
    } catch {}
    return tokens;
  },
};


