import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@theme/gradients';
import { colors } from '@theme/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { WinnerPaymentModal } from '@shared/presentation/components/WinnerPaymentModal';
import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { fetchNotifications, markAsRead, markAllAsRead, createWinnerNotification, addNotification } from '@store/slices/notificationsSlice';
import { Notification } from '@shared/domain/types';
import { featureFlags } from '@config/featureFlags';
import { useNotificationsViewModel } from '../../domain/hooks/useNotificationsViewModel';

const { width, height } = Dimensions.get('window');

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items: notifications, unreadCount, isLoading } = useAppSelector((state) => state.notifications);
  const vm = featureFlags.useMVVMNotifications ? useNotificationsViewModel() : null;
  
  // Debug deshabilitado en producción
  const { user } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedWinnerData, setSelectedWinnerData] = useState<{
    raffleName: string;
    prizeAmount: number;
    prizeType: string;
    raffleId: string;
  } | null>(null);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
    } else {
      loadData();
    }
    
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    await dispatch(fetchNotifications());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (vm) {
      await vm.refresh();
    } else {
      await loadData();
    }
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (vm) {
      await vm.markOne(notificationId);
    } else {
      await dispatch(markAsRead(notificationId));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (vm) {
      await vm.markAll();
    } else {
      await dispatch(markAllAsRead());
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    dispatch(markAsRead(notification.id));
    
    // Si es una notificación de ganador, mostrar modal de pago
    if (notification.type === 'winner') {
      // Extraer información del mensaje para el modal
      const message = notification.message;
      const prizeMatch = message.match(/Ganaste (\d+) ([^"]+) en "([^"]+)"/);
      
      if (prizeMatch) {
        const [, prizeAmount, prizeType, raffleName] = prizeMatch;
        setSelectedWinnerData({
          raffleName,
          prizeAmount: parseInt(prizeAmount, 10),
          prizeType,
          raffleId: notification.actionUrl?.split('/').pop() || 'unknown',
        });
        setShowWinnerModal(true);
      }
    } else if (notification.actionUrl) {
      // Navegar a la URL de acción
      (navigation as any).navigate(notification.actionUrl as any);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'points':
        return 'trending-up';
      case 'reward':
        return 'gift';
      case 'raffle':
        return 'trophy';
      case 'winner':
        return 'trophy';
      case 'general':
        return 'notifications';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'points':
        return ['#10b981', '#34d399'];
      case 'reward':
        return ['#66bb6a', '#4caf50'];
      case 'raffle':
        return ['#ffd700', '#ffb300'];
      case 'winner':
        return ['#ffd700', '#ffb300'];
      case 'general':
        return ['#6b7280', '#9ca3af'];
      default:
        return ['#6b7280', '#9ca3af'];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace un momento';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity 
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.8}
      >
        <Card style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotification
        ] as any}>
          <View style={styles.notificationContent}>
            <LinearGradient
              colors={getNotificationColor(item.type) as [string, string, string]}
              style={styles.notificationIcon}
            >
              <Ionicons 
                name={getNotificationIcon(item.type) as any} 
                size={20} 
                color="#fff" 
              />
            </LinearGradient>
            
            <View style={styles.notificationDetails}>
              <Text style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadTitle
              ]}>
                {item.title}
              </Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>{formatDate(item.createdAt || new Date().toISOString())}</Text>
            </View>
            
            {!item.isRead && (
              <View style={styles.unreadIndicator} />
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "transparent"] as unknown as [string, string]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <View style={styles.titleRow}>
                <Ionicons name="notifications-outline" size={22} color={colors.primary600} style={styles.titleIcon} />
                <Text style={[getVariantStyle('h1'), styles.title]}>Notificaciones</Text>
              </View>
              <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
              </Text>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity 
                style={styles.markAllButton}
                onPress={handleMarkAllAsRead}
              >
                <Text style={[getVariantStyle('caption'), styles.markAllText]}>Marcar todas</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Botón de prueba para crear notificación de ganador */}
      <Animated.View
        style={[
          styles.testContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            // Usar el reducer directo para evitar problemas con el thunk
            dispatch(addNotification({
              id: `winner-${Date.now()}`,
              userId: '1',
              title: '🎉 ¡FELICIDADES! ¡Has ganado un sorteo!',
              message: 'Ganaste 1000 USD en "Sorteo Mega de $1000 USD". Toca para recibir tu premio.',
              type: 'winner',
              isRead: false,
              createdAt: new Date().toISOString(),
              actionUrl: '/raffles/active-1',
            }));
          }}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.testButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="star" size={16} color="#fff" />
            <Text style={styles.testButtonText}>🧪 Crear Notificación de Ganador</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Notifications List */}
      <FlatList
        data={vm ? vm.notifications : notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.emptyStateIcon}>
              <Ionicons name="notifications-off-outline" size={64} color="#6c757d" />
            </View>
            <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No hay notificaciones</Text>
            <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
              ¡Aquí aparecerán todas tus notificaciones importantes!
            </Text>
            <Button
              title="Jugar Trivia"
              onPress={() => navigation.navigate('Categories' as never)}
              gradient
              style={styles.emptyStateButton}
            />
          </Animated.View>
        )}
      />
      
      {/* Modal de Pago para Ganadores */}
      <WinnerPaymentModal
        visible={showWinnerModal}
        onClose={() => {
          setShowWinnerModal(false);
          setSelectedWinnerData(null);
        }}
        winnerData={selectedWinnerData}
        userName={user?.name || 'Usuario'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 0,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
    // Sombra eliminada para un look más limpio
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    opacity: 0.9,
  },
  markAllButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContainer: {
    padding: 20,
  },
  notificationCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary600,
    backgroundColor: colors.surface,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: colors.muted,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    backgroundColor: colors.background,
    borderRadius: 50,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  testContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  testButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  testButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
});
