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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@shared/presentation/components/ui/Card';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchUserRewards, markRewardAsUsed } from '../../store/slices/rewardsSlice';
import { featureFlags } from '../../config/featureFlags';
import { useRewardsViewModel } from '../../viewmodels/rewards/useRewardsViewModel';
import { UserReward } from '../../types';

const { width, height } = Dimensions.get('window');

export const MyRewardsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userRewards, available: rewards, isLoading } = useAppSelector((state) => state.rewards);
  const vm = featureFlags.useMVVMRewards ? useRewardsViewModel() : null;
  const [refreshing, setRefreshing] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

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
    ]).start();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchUserRewards()),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
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

  const handleMarkAsUsed = async (userRewardId: string) => {
    try {
      await dispatch(markRewardAsUsed(userRewardId)).unwrap();
      Alert.alert('¡Premio marcado como usado!', 'El premio ha sido marcado como utilizado exitosamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar el premio como usado. Inténtalo de nuevo.');
    }
  };

  const getRewardDetails = (userReward: UserReward) => {
    const base = vm ? vm.available : rewards;
    return base.find((r: any) => r.id === userReward.rewardId);
  };

  const getRewardIcon = (category: string) => {
    switch (category) {
      case 'entertainment':
        return 'film';
      case 'food':
        return 'restaurant';
      case 'shopping':
        return 'bag';
      case 'gaming':
        return 'game-controller';
      case 'education':
        return 'school';
      default:
        return 'gift';
    }
  };

  const getRewardColor = (category: string) => {
    switch (category) {
      case 'entertainment':
        return ['#ff6b6b', '#ee5a52'];
      case 'food':
        return ['#ffa726', '#ff9800'];
      case 'shopping':
        return ['#42a5f5', '#2196f3'];
      case 'gaming':
        return ['#ab47bc', '#9c27b0'];
      case 'education':
        return ['#66bb6a', '#4caf50'];
      default:
        return ['#26a69a', '#009688'];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const renderUserReward = ({ item, index }: { item: UserReward; index: number }) => {
    const reward = getRewardDetails(item);
    if (!reward) return null;

    const expired = isExpired(item.expiresAt || '');
    const used = item.isUsed;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Card style={styles.rewardCard}>
          <LinearGradient
            colors={getRewardColor(reward.category) as [string, string, string]}
            style={styles.rewardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.rewardHeader}>
              <View style={styles.rewardIconContainer}>
                <Ionicons 
                  name={getRewardIcon(reward.category) as any} 
                  size={24} 
                  color="#fff" 
                />
              </View>
              <View style={styles.rewardStatus}>
                {used && (
                  <View style={styles.usedBadge}>
                    <Text style={styles.usedText}>Usado</Text>
                  </View>
                )}
                {expired && !used && (
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredText}>Expirado</Text>
                  </View>
                )}
                {!used && !expired && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>Activo</Text>
                  </View>
                )}
              </View>
            </View>
            
            <Text style={styles.rewardTitle}>{reward.name}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            
            <View style={styles.rewardInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="code-outline" size={16} color="#fff" />
                <Text style={styles.infoText}>Código: {item.redemptionCode}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={16} color="#fff" />
                <Text style={styles.infoText}>
                  Canjeado: {formatDate(item.redeemedAt)}
                </Text>
              </View>
              {item.expiresAt && (
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <Text style={styles.infoText}>
                    Expira: {formatDate(item.expiresAt)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instrucciones:</Text>
              <Text style={styles.instructionsText}>{reward.redemptionInstructions}</Text>
            </View>

            {!used && !expired && (
              <TouchableOpacity
                style={styles.useButton}
                onPress={() => handleMarkAsUsed(item.id)}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.useButtonGradient}
                >
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={16} 
                    color="#fff" 
                  />
                  <Text style={styles.useButtonText}>Marcar como Usado</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Card>
      </Animated.View>
    );
  };

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
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>🎁 Mis Premios</Text>
              <Text style={styles.subtitle}>Premios canjeados y códigos de redención</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Rewards List */}
      <FlatList
        data={vm ? vm.userRewards : userRewards}
        renderItem={renderUserReward}
        keyExtractor={(item) => item.id}
        style={styles.rewardsList}
        contentContainerStyle={styles.rewardsContainer}
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
              <Ionicons name="gift-outline" size={64} color="#6c757d" />
            </View>
            <Text style={styles.emptyStateTitle}>No tienes premios canjeados</Text>
            <Text style={styles.emptyStateSubtitle}>
              ¡Canjea premios en la sección de premios para verlos aquí!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('Rewards' as never)}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyStateButtonGradient}
              >
                <Text style={styles.emptyStateButtonText}>Ver Premios</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 0,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  rewardsList: {
    flex: 1,
  },
  rewardsContainer: {
    padding: 20,
  },
  rewardCard: {
    marginBottom: 16,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  rewardGradient: {
    padding: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  rewardStatus: {
    alignItems: 'flex-end',
  },
  usedBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  usedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  expiredBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expiredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeBadge: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  rewardInfo: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 16,
  },
  useButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  useButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    backgroundColor: '#f8f9fa',
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
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
