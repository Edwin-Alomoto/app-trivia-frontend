import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_DATA_KEY = 'auth_user_data';

export const tokenStorage = {
  async save(accessToken: string, refreshToken?: string, user?: unknown) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    if (user) await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user));
  },
  async load() {
    const [accessToken, refreshToken, userStr] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(USER_DATA_KEY),
    ]);
    const user = userStr ? JSON.parse(userStr) : null;
    return { accessToken, refreshToken, user } as { accessToken: string | null; refreshToken: string | null; user: any };
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  },
};


