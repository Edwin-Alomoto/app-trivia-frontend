import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import { useAppDispatch } from '../../domain/hooks/useAppDispatch';
import { useAppSelector } from '../../domain/hooks/useAppSelector';
import { checkDemoExpiration, updateUserProfile } from '@features/auth/domain/store/authSlice';
import { fetchUserProfile } from '@features/profile/domain/store/profileSlice';
import { API_ENV } from '@shared/infrastructure/api/env';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      // Warm-up ping: intenta despertar el backend al iniciar la app
      try {
        // endpoint ligero; si no hay /health, usa una ruta pública inofensiva
        await fetch(`${API_ENV.BASE_URL}/auth/login`, { method: 'OPTIONS' });
      } catch (_e) {
        // silencioso: solo intento de warm-up
      }

      // Si hay usuario logueado, verificar perfil y sincronizar estado
      if (user) {
        try {
          const profile = await dispatch(fetchUserProfile()).unwrap();
          const userType = String(profile?.user_type || '').toUpperCase();
          
          // Sincronizar estado de suscripción con el perfil
          const subscriptionStatus = userType === 'PREMIUM' ? 'subscribed' : 
                                   userType === 'DEMO' ? 'demo' : 'not_subscribed';
          
          // Solo actualizar si hay cambio
          if (user.subscriptionStatus !== subscriptionStatus) {
            dispatch(updateUserProfile({ subscriptionStatus } as any));
          }
          
          // Guardar user_type actualizado
          await SecureStore.setItemAsync('user_type', userType);
          
          // Verificar caducidad del demo si es demo
          if (subscriptionStatus === 'demo') {
            try {
              await dispatch(checkDemoExpiration()).unwrap();
            } catch (error) {
              console.error('Error checking demo expiration on app init:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching user profile on app init:', error);
          // En caso de error, mantener el estado actual
        }
      }
    };

    initializeApp();
  }, [user, dispatch]);

  return <>{children}</>;
};
