import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

import { AuthState, LoginCredentials } from '../types';
import { User } from '@shared/domain/types';
import { RootState } from '@app/store';

const initialState: AuthState = {
  user: null, // Usuario no logueado inicialmente
  token: null,
  isLoading: false,
  error: null,
};

type AuthThunkConfig = {
  state: RootState;
  rejectValue: string;
};

// Async thunks
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginCredentials,
  AuthThunkConfig
>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 700));

      // Simular credenciales incorrectas
      if (credentials.password !== '12345678') {
        throw new Error('credenciales_invalidas');
      }

      // Mock response exitoso - usuario no suscrito por defecto
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

      // Guardar token en SecureStore
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));

      return { user: mockUser, token };
    } catch (error: any) {
      // Manejar diferentes tipos de error
      if (error.message === 'credenciales_invalidas') {
        return rejectWithValue('Email o contraseña incorrectos.');
      }

      return rejectWithValue('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  }
);

export const registerUser = createAsyncThunk<
  { user: User; requiresVerification: boolean },
  { email: string; password: string },
  AuthThunkConfig
>(
  'auth/register',
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response - usuario en estado pendiente de verificación
      const mockUser: User = {
        id: '1',
        email: userData.email,
        name: userData.email.split('@')[0], // Usar parte del email como nombre temporal
        alias: userData.email.split('@')[0], // Usar parte del email como alias temporal
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

      // En el prototipo, no guardamos el token hasta que se verifique el email
      // Simulamos que el usuario está en estado "pendiente de verificación"

      return { user: mockUser, requiresVerification: true };
    } catch (error) {
      return rejectWithValue('Error al registrar usuario');
    }
  }
);

export const verifyEmail = createAsyncThunk<
  { user: User; token: string },
  string,
  AuthThunkConfig
>(
  'auth/verifyEmail',
  async (verificationToken: string, { rejectWithValue }) => {
    try {
      // Simulación de verificación de email
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock response - usuario verificado pero no suscrito
      const mockUser: User = {
        id: '1',
        email: 'usuario@demo.com',
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

      // Guardar token en SecureStore después de verificación
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));

      return { user: mockUser, token };
    } catch (error) {
      return rejectWithValue('Error al verificar email');
    }
  }
);

export const logoutUser = createAsyncThunk<
  null,
  void,
  AuthThunkConfig
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Limpiar SecureStore
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      return null;
    } catch (error) {
      return rejectWithValue('Error al cerrar sesión');
    }
  }
);

export const checkAuthStatus = createAsyncThunk<
  { user: User; token: string } | null,
  void,
  AuthThunkConfig
>(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        return { user, token };
      }

      return null;
    } catch (error) {
      return rejectWithValue('Error al verificar autenticación');
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  User,
  Partial<User>,
  AuthThunkConfig
>(
  'auth/updateProfile',
  async (updates: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error('Usuario no autenticado');

      const updatedUser = { ...auth.user, ...updates };

      // Guardar en SecureStore
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue('Error al actualizar perfil');
    }
  }
);

export const activateDemoMode = createAsyncThunk<
  User,
  void,
  AuthThunkConfig
>(
  'auth/activateDemo',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error('Usuario no autenticado');

      // Simular activación de modo demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      const demoExpiresAt = new Date();
      demoExpiresAt.setDate(demoExpiresAt.getDate() + 7); // 7 días de prueba

      const updatedUser: User = {
        ...auth.user,
        subscriptionStatus: 'demo',
        demoExpiresAt: demoExpiresAt.toISOString(),
        points: 100, // Puntos iniciales de demo
      };

      // Guardar en SecureStore
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue('Error al activar modo demo');
    }
  }
);

export const activateSubscription = createAsyncThunk<
  User,
  void,
  AuthThunkConfig
>(
  'auth/activateSubscription',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error('Usuario no autenticado');

      // Simular proceso de suscripción
      await new Promise(resolve => setTimeout(resolve, 2000));

      const subscriptionExpiresAt = new Date();
      subscriptionExpiresAt.setMonth(subscriptionExpiresAt.getMonth() + 1); // 1 mes de suscripción

      const updatedUser: User = {
        ...auth.user,
        subscriptionStatus: 'subscribed',
        subscriptionExpiresAt: subscriptionExpiresAt.toISOString(),
        points: auth.user.subscriptionStatus === 'demo' ? auth.user.points : 500, // Mantener puntos demo o dar inicial
      };

      // Guardar en SecureStore
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue('Error al activar suscripción');
    }
  }
);

export type DemoExpirationCheck =
  | { action: 'none' }
  | { action: 'warning'; daysLeft: number }
  | { action: 'expired' };

export const checkDemoExpiration = createAsyncThunk<
  DemoExpirationCheck,
  void,
  AuthThunkConfig
>(
  'auth/checkDemoExpiration',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user || auth.user.subscriptionStatus !== 'demo') {
        return { action: 'none' };
      }

      const currentDate = new Date();
      const expirationDate = new Date(auth.user.demoExpiresAt!);
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      // Si ya expiró
      if (daysUntilExpiration <= 0) {
        return { action: 'expired' };
      }

      // Si expira en 1 día o menos
      if (daysUntilExpiration <= 1) {
        return { action: 'warning', daysLeft: daysUntilExpiration };
      }

      return { action: 'none' };
    } catch (error) {
      return rejectWithValue('Error al verificar expiración del demo');
    }
  }
);

export const handleDemoExpiration = createAsyncThunk<
  User,
  void,
  AuthThunkConfig
>(
  'auth/handleDemoExpiration',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error('Usuario no autenticado');

      // Marcar como expirado
      const updatedUser: User = {
        ...auth.user,
        subscriptionStatus: 'expired',
        points: 0, // Eliminar puntos demo
      };

      // Guardar en SecureStore
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue('Error al manejar expiración del demo');
    }
  }
);

export const migrateDemoPoints = createAsyncThunk<
  { user: User; migratedPoints: number },
  void,
  AuthThunkConfig
>(
  'auth/migrateDemoPoints',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error('Usuario no autenticado');

      // Migrar puntos demo a reales
      const demoPoints = auth.user.points || 0;

      const updatedUser: User = {
        ...auth.user,
        subscriptionStatus: 'subscribed',
        points: demoPoints, // Mantener los puntos demo como reales
        demoExpiresAt: undefined, // Eliminar fecha de expiración demo
      };

      // Guardar en SecureStore
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));

      return { user: updatedUser, migratedPoints: demoPoints };
    } catch (error) {
      return rejectWithValue('Error al migrar puntos demo');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.points = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // No establecemos el token hasta que se verifique el email
        if (!action.payload.requiresVerification && 'token' in action.payload) {
          state.token = action.payload.token as string;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Activate Demo Mode
      .addCase(activateDemoMode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateDemoMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(activateDemoMode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Activate Subscription
      .addCase(activateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(activateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Demo Expiration
      .addCase(checkDemoExpiration.fulfilled, (_state, _action) => {
        // No cambiar el estado, solo retornar la acción
      })
      // Handle Demo Expiration
      .addCase(handleDemoExpiration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleDemoExpiration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(handleDemoExpiration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Migrate Demo Points
      .addCase(migrateDemoPoints.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(migrateDemoPoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(migrateDemoPoints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserPoints } = authSlice.actions;
export default authSlice.reducer;

// Selectores memoizados
export const selectAuth = (state: RootState) => state.auth;
export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.isLoading);
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);
export const selectAuthUser = createSelector(selectAuth, (auth) => auth.user);
export const selectAuthToken = createSelector(selectAuth, (auth) => auth.token);
export const selectIsAuthenticated = createSelector(selectAuth, (auth) => Boolean(auth.token));
export const selectSubscriptionStatus = createSelector(selectAuth, (auth) => auth.user?.subscriptionStatus ?? 'not_subscribed');
