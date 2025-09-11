import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { checkDemoExpiration, handleDemoExpiration, migrateDemoPoints } from '../store/slices/authSlice';


export const useDemoStatus = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [expirationChecked, setExpirationChecked] = useState(false);

  const isDemoUser = user?.subscriptionStatus === 'demo';
  const isSubscribed = user?.subscriptionStatus === 'subscribed';
  const isExpired = user?.subscriptionStatus === 'expired';

  const getDaysLeft = (): number => {
    if (!user?.demoExpiresAt) return 0;
    
    const expirationDate = new Date(user.demoExpiresAt);
    const currentDate = new Date();
    const diffTime = expirationDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const isExpiredDemo = (): boolean => {
    if (!isDemoUser) return false;
    return getDaysLeft() <= 0;
  };

  const canAccessPremiumFeatures = (): boolean => {
    return isSubscribed || (isDemoUser && !isExpiredDemo());
  };

  // Los usuarios demo pueden ver premios pero no canjearlos
  const canRedeemRewards = (): boolean => {
    return isSubscribed; // Solo usuarios suscritos pueden canjear premios
  };

  // Los usuarios demo pueden ver sorteos pero no participar
  const canParticipateInRaffles = (): boolean => {
    return isSubscribed; // Solo usuarios suscritos pueden participar en sorteos
  };

  // Los usuarios demo pueden acceder a las secciones para ver el catálogo
  const canViewRewards = (): boolean => {
    return isSubscribed || (isDemoUser && !isExpiredDemo());
  };

  const canViewRaffles = (): boolean => {
    return isSubscribed || (isDemoUser && !isExpiredDemo());
  };

  const getSubscriptionMessage = (): string => {
    if (isDemoUser) {
      const daysLeft = getDaysLeft();
      if (daysLeft > 0) {
        return `Modo demo: ${daysLeft} día${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`;
      } else {
        return 'Demo expirado. Suscríbete para continuar.';
      }
    }
    
    if (isSubscribed) {
      return 'Usuario Premium';
    }
    
    return 'Usuario no suscrito';
  };

  // Verificar caducidad del demo al cargar
  useEffect(() => {
    const checkExpiration = async () => {
      if (isDemoUser && !expirationChecked) {
        try {
          const result = await dispatch(checkDemoExpiration()).unwrap();
          
          if (result.action === 'expired') {
            // Demo expirado - mostrar alerta y manejar expiración
            Alert.alert(
              'Demo Expirado',
              'Tu período de prueba ha expirado. Tus puntos demo han sido eliminados.',
              [
                {
                  text: 'Suscribirse',
                  onPress: () => handleSubscribe(),
                },
                {
                  text: 'Continuar sin demo',
                  style: 'cancel',
                  onPress: () => handleExpiration(),
                },
              ]
            );
          } else if (result.action === 'warning') {
            // Advertencia de expiración próxima
            Alert.alert(
              'Demo por Expirar',
              `Tu período de prueba expira en ${result.daysLeft} día${result.daysLeft !== 1 ? 's' : ''}. Suscríbete para mantener tus puntos.`,
              [
                {
                  text: 'Suscribirse',
                  onPress: () => handleSubscribe(),
                },
                {
                  text: 'Recordar más tarde',
                  style: 'cancel',
                },
              ]
            );
          }
        } catch (error) {
          console.error('Error checking demo expiration:', error);
        }
        setExpirationChecked(true);
      }
    };

    checkExpiration();
  }, [isDemoUser, expirationChecked, dispatch]);

  const handleExpiration = async () => {
    try {
      await dispatch(handleDemoExpiration()).unwrap();
    } catch (error) {
      console.error('Error handling demo expiration:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const result = await dispatch(migrateDemoPoints()).unwrap();
      Alert.alert(
        '¡Suscripción Activada!',
        `Se han migrado ${result.migratedPoints} puntos demo a tu cuenta premium.`,
        [{ text: 'Continuar', style: 'default' }]
      );
    } catch (error) {
      console.error('Error migrating demo points:', error);
      Alert.alert('Error', 'No se pudo activar la suscripción. Inténtalo de nuevo.');
    }
  };

  return {
    isDemoUser,
    isSubscribed,
    isExpired,
    daysLeft: getDaysLeft(),
    isExpiredDemo: isExpiredDemo(),
    canAccessPremiumFeatures: canAccessPremiumFeatures(),
    canRedeemRewards: canRedeemRewards(),
    canParticipateInRaffles: canParticipateInRaffles(),
    canViewRewards: canViewRewards(),
    canViewRaffles: canViewRaffles(),
    subscriptionMessage: getSubscriptionMessage(),
    handleExpiration,
    handleSubscribe,
  };
};
