import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

import { AuthRepository } from '../../data/repositories/AuthRepository';
import { User } from '../../../../shared/domain/types';
import { handleApiError } from '../../../../shared/data/utils/handleApiError';
import { tokenStorage } from '../../../../shared/data/services/tokenStorage';
import { AuthState, LoginCredentials } from '../types';
import { RegisterPayload } from '../models/Register';

const initialState: AuthState = {
  user: null, // Usuario no logueado inicialmente
  token: null,
  isLoading: false,
  error: null,
};

type AuthThunkConfig = {
  state: { auth: AuthState };
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
      const { user: userDto, tokens } = await AuthRepository.login({ email: credentials.email, password: credentials.password });

      // Mapear UserDto -> User (tipo compartido de la app) con valores por defecto
      const mappedUser: User = {
        id: userDto.id,
        email: userDto.email,
        name: userDto.username,
        alias: userDto.username,
        points: 0,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          language: 'es',
          sound: true,
          haptics: true,
        },
        subscriptionStatus: 'not_subscribed',
        role: (userDto as any).role,
      } as User;

      // Guardar también en SecureStore legacy para compatibilidad con flujos existentes
      await SecureStore.setItemAsync('auth_token', tokens.accessToken);
      await SecureStore.setItemAsync('user_data', JSON.stringify(mappedUser));

      return { user: mappedUser, token: tokens.accessToken };
    } catch (e: any) {
      const err = handleApiError(e);
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  RegisterPayload,
  AuthThunkConfig
>(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      console.log('🟠 [registerUser thunk] Iniciando registro con payload:', JSON.stringify(payload, null, 2));
      const { user: userDto, tokens } = await AuthRepository.register(payload);
      console.log('🟠 [registerUser thunk] AuthRepository respondió, mapeando usuario...');
      const mappedUser: User = {
        id: userDto.id,
        email: userDto.email,
        name: (userDto as any).first_name ?? userDto.username,
        alias: userDto.username,
        points: 0,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          language: 'es',
          sound: true,
          haptics: true,
        },
        subscriptionStatus: 'not_subscribed',
        role: (userDto as any).role,
      } as User;
      console.log('🟠 [registerUser thunk] Usuario mapeado:', JSON.stringify(mappedUser, null, 2));
      await SecureStore.setItemAsync('auth_token', tokens.accessToken);
      await SecureStore.setItemAsync('user_data', JSON.stringify(mappedUser));
      console.log('🟢 [registerUser thunk] Registro completado exitosamente');
      return { user: mappedUser, token: tokens.accessToken };
    } catch (e: any) {
      console.log('🔴 [registerUser thunk] Error en registro:', e);
      const err = handleApiError(e);
      console.log('🔴 [registerUser thunk] Error procesado:', err.message);
      return rejectWithValue(err.message);
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
      console.log('🔴 [authSlice.logoutUser] Iniciando logout...');
      await AuthRepository.logout();
      console.log('🔴 [authSlice.logoutUser] Logout exitoso');
      return null;
    } catch (error) {
      console.log('🔴 [authSlice.logoutUser] Error en logout:', error);
      return rejectWithValue('Error al cerrar sesión');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  void,
  string,
  AuthThunkConfig
>(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      console.log('🟠 [authSlice.forgotPassword] Iniciando solicitud para:', email);
      await AuthRepository.forgotPassword(email);
      console.log('🟢 [authSlice.forgotPassword] Solicitud exitosa');
    } catch (error) {
      console.log('🔴 [authSlice.forgotPassword] Error:', error);
      const err = handleApiError(error as any);
      return rejectWithValue(err.message);
    }
  }
);

export const resetPassword = createAsyncThunk<
  void,
  { token: string; newPassword: string; confirmPassword: string },
  AuthThunkConfig
>(
  'auth/resetPassword',
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      console.log('🟣 [authSlice.resetPassword] Iniciando restablecimiento con token');
      await AuthRepository.resetPassword(token, newPassword, confirmPassword);
      console.log('🟢 [authSlice.resetPassword] Restablecimiento exitoso');
    } catch (error) {
      console.log('🔴 [authSlice.resetPassword] Error:', error);
      const err = handleApiError(error as any);
      return rejectWithValue(err.message);
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
      console.log('🔄 [authSlice.checkAuthStatus] Verificando estado de autenticación...');
      const { accessToken, user } = await tokenStorage.load();

      if (accessToken && user) {
        console.log('🟢 [authSlice.checkAuthStatus] Usuario autenticado encontrado');
        return { user, token: accessToken };
      }

      console.log('🔴 [authSlice.checkAuthStatus] No hay sesión activa');
      return null;
    } catch (error) {
      console.log('❌ [authSlice.checkAuthStatus] Error:', error);
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
        state.token = action.payload.token;
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
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
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
import type { RootState } from '../../../../store';
export const selectAuth = (state: RootState) => state.auth;
export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.isLoading);
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);
export const selectAuthUser = createSelector(selectAuth, (auth) => auth.user);
export const selectAuthToken = createSelector(selectAuth, (auth) => auth.token);
export const selectIsAuthenticated = createSelector(selectAuth, (auth) => Boolean(auth.token));
export const selectSubscriptionStatus = createSelector(selectAuth, (auth) => auth.user?.subscriptionStatus ?? 'not_subscribed');
