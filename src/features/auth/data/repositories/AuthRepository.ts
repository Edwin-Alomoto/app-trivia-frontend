import { authApi } from '../services/authApi';
import { tokenStorage } from '../../../../shared/data/services/tokenStorage';
import { Credentials } from '../../domain/models/Credentials';
import { RegisterPayload } from '../../domain/models/Register';

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
    console.log('🟡 [AuthRepository.logout] Iniciando logout...');
    const { refreshToken } = await tokenStorage.load();
    if (refreshToken) {
      console.log('🟡 [AuthRepository.logout] Llamando API de logout...');
      await authApi.logout(refreshToken);
      console.log('🟡 [AuthRepository.logout] API de logout exitosa');
    } else {
      console.log('🟡 [AuthRepository.logout] No hay refreshToken, saltando API');
    }
    console.log('🟡 [AuthRepository.logout] Limpiando tokens locales...');
    await tokenStorage.clear();
    try {
      const { apiClient } = await import('../../../../shared/data/services/apiClient');
      await apiClient.setTokens(null, null);
      console.log('🟡 [AuthRepository.logout] apiClient limpiado');
    } catch (e) {
      console.log('🟡 [AuthRepository.logout] Error limpiando apiClient:', e);
    }
    console.log('🟢 [AuthRepository.logout] Logout completado');
  },
  async register(payload: RegisterPayload) {
    console.log('🟡 [AuthRepository.register] Iniciando registro con payload:', JSON.stringify(payload, null, 2));
    const { user, tokens } = await authApi.register(payload);
    console.log('🟡 [AuthRepository.register] API respondió, guardando tokens...');
    await tokenStorage.save(tokens.accessToken, tokens.refreshToken, user);
    console.log('🟡 [AuthRepository.register] Tokens guardados en SecureStore');
    try {
      const { apiClient } = await import('../../../../shared/data/services/apiClient');
      await apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
      console.log('🟡 [AuthRepository.register] Tokens sincronizados con apiClient');
    } catch (e) {
      console.log('🟡 [AuthRepository.register] Error sincronizando apiClient:', e);
    }
    console.log('🟢 [AuthRepository.register] Registro completado exitosamente');
    return { user, tokens };
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
  async forgotPassword(email: string): Promise<void> {
    console.log('🟡 [AuthRepository.forgotPassword] Iniciando solicitud de restablecimiento...');
    await authApi.forgotPassword(email);
    console.log('🟢 [AuthRepository.forgotPassword] Solicitud completada');
  },
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    console.log('🟡 [AuthRepository.resetPassword] Iniciando restablecimiento de contraseña...');
    await authApi.resetPassword(token, newPassword, confirmPassword);
    console.log('🟢 [AuthRepository.resetPassword] Restablecimiento completado');
  },
};


