import React, { useEffect } from 'react';

import { useAppDispatch } from '../../domain/hooks/useAppDispatch';
import { useAppSelector } from '../../domain/hooks/useAppSelector';
import { checkDemoExpiration } from '@features/auth/domain/store/authSlice';
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

      // Verificar caducidad del demo si el usuario está logueado
      if (user && user.subscriptionStatus === 'demo') {
        try {
          await dispatch(checkDemoExpiration()).unwrap();
        } catch (error) {
          console.error('Error checking demo expiration on app init:', error);
        }
      }
    };

    initializeApp();
  }, [user, dispatch]);

  return <>{children}</>;
};
