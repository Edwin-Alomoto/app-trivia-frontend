import { authApi } from '../services/authApi';
import { tokenStorage } from '../../../../shared/data/services/tokenStorage';
import { Credentials } from '../../domain/models/Credentials';

export const AuthRepository = {
  async login(credentials: Credentials) {
    const { user, tokens } = await authApi.login(credentials);
    await tokenStorage.save(tokens.accessToken, tokens.refreshToken, user);
    return { user, tokens };
  },
  async logout() {
    await tokenStorage.clear();
  },
};


