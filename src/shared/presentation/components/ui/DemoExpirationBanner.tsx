import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useDemoStatus } from '@shared/domain/hooks/useDemoStatus';

interface DemoExpirationBannerProps {
  onSubscribe?: () => void;
}

export const DemoExpirationBanner: React.FC<DemoExpirationBannerProps> = ({ onSubscribe }) => {
  const { isDemoUser, daysLeft, isExpiredDemo, handleSubscribe } = useDemoStatus();

  // Solo mostrar si es usuario demo
  if (!isDemoUser) return null;

  // Si ya expiró, no mostrar banner (se maneja con alerta)
  if (isExpiredDemo) return null;

  // Solo mostrar si quedan 3 días o menos
  if (daysLeft > 3) return null;

  const getBannerColors = () => {
    if (daysLeft === 0) return ['#ef4444', '#dc2626']; // Rojo - expirado
    if (daysLeft === 1) return ['#f59e0b', '#d97706']; // Naranja - último día
    return ['#3b82f6', '#1d4ed8']; // Azul - advertencia
  };

  const getBannerText = () => {
    if (daysLeft === 0) return '¡Demo expirado!';
    if (daysLeft === 1) return '¡Último día de demo!';
    return `Demo expira en ${daysLeft} días`;
  };

  const getBannerIcon = () => {
    if (daysLeft === 0) return 'warning';
    if (daysLeft === 1) return 'time';
    return 'information-circle';
  };

  const handleSubscribePress = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      handleSubscribe();
    }
  };

  const colorsResolved = getBannerColors() as unknown as Readonly<[string, string, ...string[]]>;
  return (
    <LinearGradient
      colors={colorsResolved}
      style={styles.banner}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerInfo}>
          <Ionicons name={getBannerIcon() as any} size={20} color="#fff" />
          <Text style={styles.bannerText}>{getBannerText()}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribePress}
        >
          <Text style={styles.subscribeButtonText}>Suscribirse</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
