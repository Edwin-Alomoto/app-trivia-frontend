import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { featureFlags } from '../../config/featureFlags';
import { useRafflesViewModel } from '../../viewmodels/raffles/useRafflesViewModel';

const { width, height } = Dimensions.get('window');

interface MyRaffle {
  id: string;
  name: string;
  prize: string;
  category: string;
  participationDate: string;
  status: 'active' | 'completed' | 'won' | 'lost';
  drawDate: string;
  participants: number;
  maxParticipants: number;
  myPosition?: number;
  isWinner?: boolean;
  prizeAmount?: number;
}

export const MyRafflesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const vm = featureFlags.useMVVMRaffles ? useRafflesViewModel() : null;
  
  const [refreshing, setRefreshing] = useState(false);
  const [myRaffles, setMyRaffles] = useState<MyRaffle[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'won'>('all');

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Datos mock de mis sorteos
  const mockMyRaffles: MyRaffle[] = [
    {
      id: '1',
      name: 'Sorteo Mega de $1000 USD',
      prize: '$1000 USD en efectivo',
      category: 'money',
      participationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      drawDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      participants: 847,
      maxParticipants: 1000,
      myPosition: 156,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      prize: 'iPhone 15 Pro Max 256GB',
      category: 'electronics',
      participationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      drawDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      participants: 500,
      maxParticipants: 500,
      isWinner: true,
      prizeAmount: 1200,
    },
    {
      id: '3',
      name: 'Gift Card Amazon $500',
      prize: 'Gift Card Amazon $500 USD',
      category: 'gift-cards',
      participationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      drawDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 300,
      maxParticipants: 300,
      isWinner: false,
    },
    {
      id: '4',
      name: 'Sorteo PlayStation 5',
      prize: 'PlayStation 5 + 2 Controles',
      category: 'electronics',
      participationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      drawDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 234,
      maxParticipants: 1000,
      myPosition: 89,
    },
  ];

  useEffect(() => {
    loadData();
    
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
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMyRaffles(mockMyRaffles);
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

  const computeVmRaffles = (): MyRaffle[] => {
    if (!vm) return [];
    const now = new Date();
    return (vm.userParticipations || []).map((p: any) => {
      const raffle = (vm.active || []).find((r: any) => r.id === p.raffleId);
      const statusFromVm: 'active' | 'completed' | 'won' = p.status === 'winner'
        ? 'won'
        : raffle && raffle.isActive && new Date(raffle.endDate) > now
          ? 'active'
          : 'completed';
      return {
        id: p.raffleId,
        name: raffle?.name || p.raffleName || 'Sorteo',
        prize: raffle?.prize || 'Premio',
        category: raffle?.category || 'gift-cards',
        participationDate: p.participationDate,
        status: statusFromVm,
        drawDate: raffle?.drawDate || p.participationDate,
        participants: raffle?.currentParticipants || 0,
        maxParticipants: raffle?.maxParticipants || 0,
        myPosition: undefined,
        isWinner: p.status === 'winner',
        prizeAmount: raffle?.prizeValue,
      } as MyRaffle;
    });
  };

  const dataSource: MyRaffle[] = vm ? computeVmRaffles() : myRaffles;

  const getFilteredRaffles = () => {
    if (filter === 'all') return dataSource;
    return dataSource.filter((raffle: MyRaffle) => raffle.status === filter);
  };

  const getStatusColor = (status: string): [string, string] => {
    switch (status) {
      case 'active':
        return ['#10b981', '#059669'];
      case 'completed':
        return ['#6b7280', '#4b5563'];
      case 'won':
        return ['#f59e0b', '#d97706'];
      case 'lost':
        return ['#ef4444', '#dc2626'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'won':
        return '¡Ganaste!';
      case 'lost':
        return 'No ganaste';
      default:
        return 'Desconocido';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'money':
        return 'cash';
      case 'electronics':
        return 'phone-portrait';
      case 'gift-cards':
        return 'card';
      default:
        return 'gift';
    }
  };

  const formatTimeRemaining = (drawDate: string) => {
    const now = new Date();
    const draw = new Date(drawDate);
    const diff = draw.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Menos de 1h';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderRaffleCard = (raffle: MyRaffle) => (
    <Animated.View
      key={raffle.id}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity onPress={() => {
        if (raffle.isWinner) {
          Alert.alert(
            '¡Felicitaciones!',
            `¡Ganaste ${raffle.prize}! Contacta con soporte para recibir tu premio.`,
            [{ text: 'Entendido' }]
          );
        }
      }}>
        <Card style={styles.raffleCard}>
          <LinearGradient
            colors={getStatusColor(raffle.status)}
            style={styles.raffleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.raffleHeader}>
              <View style={styles.raffleInfo}>
                <Text style={styles.raffleName}>{raffle.name}</Text>
                <Text style={styles.rafflePrize}>{raffle.prize}</Text>
                <Text style={styles.raffleDate}>
                  Participaste: {formatDate(raffle.participationDate)}
                </Text>
              </View>
              <View style={styles.raffleIcon}>
                <Ionicons name={getCategoryIcon(raffle.category) as any} size={32} color="#fff" />
              </View>
            </View>
            
            <View style={styles.raffleDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado:</Text>
                <Text style={styles.detailValue}>{getStatusText(raffle.status)}</Text>
              </View>
              
              {raffle.status === 'active' && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sorteo:</Text>
                    <Text style={styles.detailValue}>{formatTimeRemaining(raffle.drawDate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Posición:</Text>
                    <Text style={styles.detailValue}>#{raffle.myPosition} de {raffle.maxParticipants}</Text>
                  </View>
                </>
              )}
              
              {raffle.status === 'completed' && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Resultado:</Text>
                  <Text style={styles.detailValue}>
                    {raffle.isWinner ? '¡Ganaste!' : 'No ganaste'}
                  </Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Participantes:</Text>
                <Text style={styles.detailValue}>{raffle.participants}/{raffle.maxParticipants}</Text>
              </View>
            </View>
            
            {raffle.isWinner && (
              <View style={styles.winnerBadge}>
                <Ionicons name="trophy" size={16} color="#fff" />
                <Text style={styles.winnerText}>¡GANADOR!</Text>
              </View>
            )}
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const filterButtons = [
    { key: 'all', label: 'Todos', count: myRaffles.length },
    { key: 'active', label: 'Activos', count: myRaffles.filter(r => r.status === 'active').length },
    { key: 'completed', label: 'Completados', count: myRaffles.filter(r => r.status === 'completed').length },
    { key: 'won', label: 'Ganados', count: myRaffles.filter(r => r.isWinner).length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
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
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Ionicons name="ticket" size={32} color="#fff" />
              <Text style={styles.title}>Mis Sorteos</Text>
            </View>
            <View style={styles.headerStats}>
              <Text style={styles.statsText}>
                {dataSource.length} participaciones
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Filtros */}
        <Animated.View
          style={[
            styles.filterContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {filterButtons.map((button) => (
              <TouchableOpacity
                key={button.key}
                style={[
                  styles.filterButton,
                  filter === button.key && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(button.key as any)}
              >
                <LinearGradient
                  colors={
                    filter === button.key
                      ? ['#667eea', '#764ba2']
                      : ['#f8f9fa', '#e9ecef']
                  }
                  style={styles.filterButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filter === button.key && styles.filterButtonTextActive,
                    ]}
                  >
                    {button.label} ({
                      button.key === 'all'
                        ? dataSource.length
                        : dataSource.filter((r) =>
                            button.key === 'active'
                              ? r.status === 'active'
                              : button.key === 'completed'
                                ? r.status === 'completed'
                                : r.isWinner
                          ).length
                    })
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Lista de Sorteos */}
        <View style={styles.rafflesContainer}>
          {getFilteredRaffles().length > 0 ? (
            getFilteredRaffles().map(renderRaffleCard)
          ) : (
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
                <Ionicons name="ticket-outline" size={64} color="#6c757d" />
              </View>
              <Text style={styles.emptyStateTitle}>No hay sorteos</Text>
              <Text style={styles.emptyStateSubtitle}>
                {filter === 'all'
                  ? 'Aún no has participado en ningún sorteo'
                  : `No tienes sorteos ${filter === 'active' ? 'activos' : filter === 'completed' ? 'completados' : 'ganados'}`
                }
              </Text>
              <Button
                title="Ver Sorteos Disponibles"
                onPress={() => navigation.navigate('Raffles' as never)}
                gradient
                style={styles.emptyStateButton}
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonActive: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  rafflesContainer: {
    padding: 20,
  },
  raffleCard: {
    marginBottom: 16,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  raffleGradient: {
    padding: 20,
  },
  raffleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  raffleInfo: {
    flex: 1,
  },
  raffleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  rafflePrize: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  raffleDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  raffleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  raffleDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  winnerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
