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
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@theme/gradients';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { DemoRestrictionBanner } from '../../components/ui/DemoRestrictionBanner';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchRaffles, fetchUserParticipations, participateInRaffle, getRaffleWinners, checkRaffleResults } from '../../store/slices/rafflesSlice';
import { Raffle, UserRaffleParticipation } from '../../types';
import { featureFlags } from '../../config/featureFlags';
import { useRafflesViewModel } from '../../viewmodels/raffles/useRafflesViewModel';

const { width, height } = Dimensions.get('window');

const RafflesEmptyState: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name="ticket-outline" size={64} color="#6c757d" />
      </View>
      <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No hay sorteos disponibles</Text>
      <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
        ¡Vuelve más tarde para participar en nuevos sorteos!
      </Text>
      <Button
        title="Jugar Trivia"
        onPress={() => navigation.navigate('Categories' as never)}
        gradient
        style={styles.emptyStateButton}
      />
    </View>
  );
};

export const RafflesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { active: raffles, userParticipations, isLoading, error } = useAppSelector((state) => state.raffles);
  const { balance } = useAppSelector((state) => state.points);
  const { user } = useAppSelector((state) => state.auth);
  const vm = featureFlags.useMVVMRaffles ? useRafflesViewModel() : null;
  const balanceTotal = balance.total || 0;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [showRaffleDetail, setShowRaffleDetail] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [imageError, setImageError] = useState<{[key: string]: boolean}>({});

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (!vm) {
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
    try {
      await Promise.all([
        dispatch(fetchRaffles()),
        dispatch(fetchUserParticipations()),
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

  const handleParticipateInRaffle = async (raffle: Raffle) => {
    // Verificar si es usuario demo
    const isDemoUser = user?.subscriptionStatus === 'demo';
    
    if (isDemoUser) {
      Alert.alert(
        'Función Premium',
        'Los sorteos están disponibles solo para usuarios suscritos. ¡Suscríbete para participar en sorteos con premios reales!',
        [
          {
            text: 'Suscribirse',
            onPress: () => navigation.navigate('ModeSelection' as never),
            style: 'default'
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      const result = await dispatch(participateInRaffle(raffle.id)).unwrap();
      
      Alert.alert(
        '¡Participación Registrada con Éxito!',
        `Has participado en "${raffle.name}" por ${result.requiredPoints} puntos.\n\nTu ID de participación: ${result.participation.participationId}\n\nLos resultados se anunciarán el ${new Date(raffle.drawDate).toLocaleDateString()}.`,
        [
          {
            text: 'Ver mis participaciones',
            onPress: () => navigation.navigate('MyRaffles' as never)
          },
          {
            text: 'Continuar',
            style: 'cancel'
          }
        ]
      );
      
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo procesar la participación');
    }
  };

  const handleRaffleDetail = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setShowRaffleDetail(true);
  };

  const handleImageLoadStart = (raffleId: string) => {
    setImageLoading(prev => ({ ...prev, [raffleId]: true }));
    setImageError(prev => ({ ...prev, [raffleId]: false }));
  };

  const handleImageLoadEnd = (raffleId: string) => {
    setImageLoading(prev => ({ ...prev, [raffleId]: false }));
  };

  const handleImageError = (raffleId: string) => {
    setImageLoading(prev => ({ ...prev, [raffleId]: false }));
    setImageError(prev => ({ ...prev, [raffleId]: true }));
  };

  const handleCheckResults = async (raffleId: string) => {
    try {
      const result = await dispatch(checkRaffleResults(raffleId)).unwrap();
      
      if (result.isWinner) {
        Alert.alert(
          '¡FELICIDADES! 🎉',
          `¡Has ganado el sorteo "${result.raffle.name}"! Te contactaremos pronto para entregarte tu premio.`,
          [{ text: '¡Genial!' }]
        );
      } else {
        Alert.alert(
          'Resultados del Sorteo',
          `Gracias por participar en "${result.raffle.name}". Lamentablemente no fuiste el ganador esta vez, pero ¡sigue intentando!`,
          [{ text: 'Entendido' }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudieron verificar los resultados');
    }
  };

  const canParticipateInRaffle = (raffle: Raffle) => {
    const now = new Date();
    const endDate = new Date(raffle.endDate);
    const hasParticipated = userParticipations.some(p => p.raffleId === raffle.id);
    
    return raffle.isActive && 
           now <= endDate && 
           !hasParticipated && 
           balanceTotal >= raffle.requiredPoints;
  };



  const getRaffleIcon = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'phone-portrait';
      case 'gaming':
        return 'game-controller';
      case 'travel':
        return 'airplane';
      case 'shopping':
        return 'bag';
      case 'entertainment':
        return 'film';
      default:
        return 'gift';
    }
  };

  const getRaffleColor = (category: string) => {
    switch (category) {
      case 'electronics':
        return ['#ff6b6b', '#ee5a52'];
      case 'gaming':
        return ['#ab47bc', '#9c27b0'];
      case 'travel':
        return ['#42a5f5', '#2196f3'];
      case 'shopping':
        return ['#ffa726', '#ff9800'];
      case 'entertainment':
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

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Menos de 1m';
  };

  const filters = [
    { key: 'all', label: 'Todos', icon: 'grid-outline' },
    { key: 'active', label: 'Activos', icon: 'play-circle' },
    { key: 'ending', label: 'Por Terminar', icon: 'time' },
    { key: 'my-participations', label: 'Mis Participaciones', icon: 'person' },
  ];

  const dataSource: Raffle[] = vm ? vm.active : raffles;
  const userParts: UserRaffleParticipation[] = vm ? vm.userParticipations : userParticipations;
  const filteredRaffles = dataSource.filter((raffle: Raffle) => {
    if (selectedFilter === 'active') {
      return new Date(raffle.endDate) > new Date();
    } else if (selectedFilter === 'ending') {
      const endDate = new Date(raffle.endDate);
      const now = new Date();
      const diffHours = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 24;
    } else if (selectedFilter === 'my-participations') {
      return userParts.some((participation: UserRaffleParticipation) => participation.raffleId === raffle.id);
    }
    return true;
  });

  const renderRaffle = ({ item, index }: { item: Raffle; index: number }) => {
    const userParticipation = userParticipations.find(participation => participation.raffleId === item.id);
    const timeRemaining = getTimeRemaining(item.endDate);
    const isActive = new Date(item.endDate) > new Date();
    const isEndingSoon = isActive && timeRemaining.includes('h') && parseInt(timeRemaining, 10) <= 24;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        }}
      >
        <Card style={styles.raffleCard}>
          <LinearGradient
            colors={getRaffleColor(item.category) as [string, string, string]}
            style={styles.raffleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Imagen del premio */}
            <View style={styles.raffleImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.raffleImage}
                resizeMode="cover"
                onLoadStart={() => handleImageLoadStart(item.id)}
                onLoadEnd={() => handleImageLoadEnd(item.id)}
                onError={() => handleImageError(item.id)}
              />
              {imageLoading[item.id] && (
                <View style={styles.imageLoadingContainer}>
                  <Ionicons name="sync" size={24} color="#fff" />
                </View>
              )}
              {imageError[item.id] && (
                <View style={styles.imageErrorContainer}>
                  <Ionicons name="image-outline" size={48} color="#fff" />
                  <Text style={styles.imageErrorText}>Error al cargar imagen</Text>
                </View>
              )}
              <View style={styles.raffleImageOverlay}>
                <View style={styles.raffleHeader}>
                  <View style={styles.raffleIconContainer}>
                    <Ionicons 
                      name={getRaffleIcon(item.category) as any} 
                      size={24} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.raffleStatus}>
                    {isEndingSoon && (
                      <View style={styles.endingSoonBadge}>
                        <Text style={styles.endingSoonText}>¡Termina Pronto!</Text>
                      </View>
                    )}
                    <Text style={styles.rafflePrice}>{item.requiredPoints} pts</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.raffleContent}>
              <TouchableOpacity onPress={() => handleRaffleDetail(item)}>
                <Text style={styles.raffleTitle}>{item.title}</Text>
                <Text style={styles.raffleDescription}>{item.description}</Text>
              </TouchableOpacity>
              
              <View style={styles.raffleStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Participantes</Text>
                  <Text style={styles.statValue}>{item.currentParticipants}/{item.maxParticipants}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Puntos Requeridos</Text>
                  <Text style={styles.statValue}>{item.requiredPoints}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tiempo Restante</Text>
                  <Text style={styles.statValue}>{timeRemaining}</Text>
                </View>
              </View>

            {userParticipation && (
              <View style={styles.myParticipationContainer}>
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.myParticipationText}>Ya participaste</Text>
              </View>
            )}
            
            <View style={styles.raffleFooter}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      {
                        width: `${(item.currentParticipants / item.maxParticipants) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round((item.currentParticipants / item.maxParticipants) * 100)}% completo
                </Text>
              </View>
              
              <View style={styles.actionButtonsContainer}>
                {/* Botón de Participación (UC-08) */}
                <TouchableOpacity
                  style={[
                    styles.participateButton,
                    !canParticipateInRaffle(item) && styles.buyButtonDisabled
                  ]}
                  onPress={() => handleParticipateInRaffle(item)}
                  disabled={!canParticipateInRaffle(item)}
                >
                  <LinearGradient
                    colors={canParticipateInRaffle(item)
                      ? ['#10b981', '#34d399'] 
                      : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                    }
                    style={styles.participateButtonGradient}
                  >
                    <Ionicons 
                      name="star-outline" 
                      size={16} 
                      color="#fff" 
                    />
                                         <Text style={styles.participateButtonText}>
                       {!isActive ? 'Finalizado' : 
                        userParticipation ? 'Ya Participaste' :
                        balanceTotal >= item.requiredPoints ? 'Participar' : `Puntos Insuficientes (${balanceTotal}/${item.requiredPoints})`}
                     </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            </View>
          </LinearGradient>
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (estilo idéntico a Categorías) */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => (navigation as any).goBack()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={[getVariantStyle('h1'), styles.title]}>Sorteos</Text>
              <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Participa y gana premios</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Demo Banner */}
      {user?.subscriptionStatus === 'demo' && (
        <DemoRestrictionBanner type="raffles" />
      )}

      

      {/* Filters */}
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
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <LinearGradient
                colors={
                  selectedFilter === filter.key 
                    ? ['#667eea', '#764ba2'] 
                    : ['#f8f9fa', '#e9ecef']
                }
                style={styles.filterButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={selectedFilter === filter.key ? '#fff' : '#6c757d'}
                />
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Botón de Ruleta */}
        <TouchableOpacity
          style={styles.rouletteButton}
          onPress={() => {
            navigation.navigate('Roulette' as never);
          }}
        >
          <LinearGradient
            colors={['#f59e0b', '#f97316']}
            style={styles.rouletteButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="trophy" size={20} color="#fff" />
            <Text style={styles.rouletteButtonText}>Ver Ruleta de Ganadores</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Raffles List */}
      <FlatList
        data={filteredRaffles}
        renderItem={renderRaffle}
        keyExtractor={(item) => item.id}
        style={styles.rafflesList}
        contentContainerStyle={styles.rafflesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={RafflesEmptyState}
      />

      

      {/* Modal de detalles del sorteo */}
      <Modal
        visible={showRaffleDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRaffleDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedRaffle && (
              <LinearGradient
                colors={getRaffleColor(selectedRaffle.category) as [string, string, string]}
                style={styles.detailModalGradient}
              >
                {/* Imagen del premio en el modal */}
                <View style={styles.detailModalImageContainer}>
                  <Image
                    source={{ uri: selectedRaffle.image }}
                    style={styles.detailModalImage}
                    resizeMode="cover"
                    onLoadStart={() => handleImageLoadStart(`modal-${selectedRaffle.id}`)}
                    onLoadEnd={() => handleImageLoadEnd(`modal-${selectedRaffle.id}`)}
                    onError={() => handleImageError(`modal-${selectedRaffle.id}`)}
                  />
                  {imageLoading[`modal-${selectedRaffle.id}`] && (
                    <View style={styles.imageLoadingContainer}>
                      <Ionicons name="sync" size={32} color="#fff" />
                    </View>
                  )}
                  {imageError[`modal-${selectedRaffle.id}`] && (
                    <View style={styles.imageErrorContainer}>
                      <Ionicons name="image-outline" size={64} color="#fff" />
                      <Text style={styles.imageErrorText}>Error al cargar imagen</Text>
                    </View>
                  )}
                  <View style={styles.detailModalImageOverlay}>
                    <View style={styles.detailModalHeader}>
                      <Text style={[getVariantStyle('h2'), styles.detailModalTitle]}>{selectedRaffle.name}</Text>
                      <TouchableOpacity
                        onPress={() => setShowRaffleDetail(false)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailModalContent}>
                  <Text style={styles.detailModalDescription}>{selectedRaffle.description}</Text>
                
                <View style={styles.detailModalInfo}>
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="gift-outline" size={16} color="#fff" />
                    <Text style={styles.detailInfoText}>
                      Premio: {selectedRaffle.prize}
                    </Text>
                  </View>
                                     <View style={styles.detailInfoItem}>
                     <Ionicons name="wallet-outline" size={16} color="#fff" />
                     <Text style={styles.detailInfoText}>
                       Puntos requeridos: {selectedRaffle.requiredPoints} puntos
                     </Text>
                   </View>
                   <View style={styles.detailInfoItem}>
                     <Ionicons name="people-outline" size={16} color="#fff" />
                     <Text style={styles.detailInfoText}>
                       Participantes: {selectedRaffle.currentParticipants}/{selectedRaffle.maxParticipants}
                     </Text>
                   </View>
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="calendar-outline" size={16} color="#fff" />
                    <Text style={styles.detailInfoText}>
                      Fecha límite: {formatDate(selectedRaffle.endDate)}
                    </Text>
                  </View>
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="time-outline" size={16} color="#fff" />
                    <Text style={styles.detailInfoText}>
                      Tiempo restante: {getTimeRemaining(selectedRaffle.endDate)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailModalProgress}>
                  <Text style={[getVariantStyle('h2'), styles.progressTitle]}>Progreso del sorteo:</Text>
                                     <View style={styles.detailProgressBar}>
                     <Animated.View 
                       style={[
                         styles.detailProgressFill,
                         {
                           width: `${(selectedRaffle.currentParticipants / selectedRaffle.maxParticipants) * 100}%`,
                         },
                       ]}
                     />
                   </View>
                   <Text style={styles.progressText}>
                     {selectedRaffle.currentParticipants} de {selectedRaffle.maxParticipants} participantes
                   </Text>
                </View>
                
                                                  <TouchableOpacity
                   style={[
                     styles.detailBuyButton,
                     !canParticipateInRaffle(selectedRaffle) && 
                     styles.detailBuyButtonDisabled
                   ]}
                   onPress={() => {
                     setShowRaffleDetail(false);
                     handleParticipateInRaffle(selectedRaffle);
                   }}
                   disabled={!canParticipateInRaffle(selectedRaffle)}
                 >
                   <Text style={styles.detailBuyButtonText}>
                     {!selectedRaffle.isActive ? 'Sorteo Finalizado' :
                      canParticipateInRaffle(selectedRaffle) ? 'Participar' : 'Puntos Insuficientes'}
                   </Text>
                 </TouchableOpacity>
               </View>
               </LinearGradient>
            )}
          </View>
        </View>
      </Modal>
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
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
    textAlign: 'left',
    marginRight:10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    opacity: 1,
    textAlign: 'left',
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  rafflesList: {
    flex: 1,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  raffleGradient: {
    padding: 0,
  },
  raffleImageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  raffleImage: {
    width: '100%',
    height: '100%',
  },
  raffleImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  raffleContent: {
    padding: 20,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  imageErrorText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  raffleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  raffleIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  raffleStatus: {
    alignItems: 'flex-end',
  },
  endingSoonBadge: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  endingSoonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  rafflePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  raffleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  raffleDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  raffleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  myParticipationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  myParticipationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  raffleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressContainer: {
    flex: 1,
    marginRight: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  participateButton: {
    minWidth: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  participateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  participateButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    textAlign: 'center',
  },
  buyButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
    paddingHorizontal: 24,
  },

  // Detail modal styles
  detailModalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  detailModalGradient: {
    padding: 0,
  },
  detailModalImageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  detailModalImage: {
    width: '100%',
    height: '100%',
  },
  detailModalImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  detailModalDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 20,
  },
  detailModalInfo: {
    marginBottom: 20,
  },
  detailInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  detailModalProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  detailProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  detailProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  detailBuyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailBuyButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailBuyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rouletteButton: {
    marginTop: 16,
    marginHorizontal: 20,
  },
  rouletteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  rouletteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
