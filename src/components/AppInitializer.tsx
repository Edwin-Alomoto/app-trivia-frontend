import React, { useEffect } from 'react';

import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { checkDemoExpiration, checkAuthStatus } from '../features/auth/domain/store/authSlice';
import { tokenStorage } from '../shared/data/services/tokenStorage';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔄 [AppInitializer] Iniciando hidratación de sesión...');
        
        // 1. Verificar si hay tokens guardados
        const { accessToken, refreshToken } = await tokenStorage.load();
        
        if (accessToken && refreshToken) {
          console.log('🟢 [AppInitializer] Tokens encontrados, hidratando sesión...');
          // Hidratar sesión desde tokens guardados
          await dispatch(checkAuthStatus()).unwrap();
          console.log('✅ [AppInitializer] Sesión hidratada exitosamente');
        } else {
          console.log('🔴 [AppInitializer] No hay tokens, usuario no autenticado');
        }
        
        // 2. Verificar caducidad del demo si el usuario está logueado
        if (user && user.subscriptionStatus === 'demo') {
          console.log('🟡 [AppInitializer] Verificando expiración del demo...');
          await dispatch(checkDemoExpiration()).unwrap();
        }
        
      } catch (error) {
        console.error('❌ [AppInitializer] Error en inicialización:', error);
        // Si hay error, limpiar tokens corruptos
        await tokenStorage.clear();
      }
    };

    initializeApp();
  }, [dispatch]);

  return <>{children}</>;
};
