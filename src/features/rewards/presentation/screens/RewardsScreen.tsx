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
import { DemoRestrictionBanner } from '@shared/presentation/components/ui/DemoRestrictionBanner';
import { useAppDispatch } from '@shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '@shared/domain/hooks/useAppSelector';
import { fetchRewards, fetchUserRewards, redeemReward, markRewardAsUsed } from '@store/slices/rewardsSlice';
import { Reward } from '@shared/domain/types';
import { featureToggles } from '@config/featureToggles';
import { useRewardsViewModel } from '../../domain/hooks/useRewardsViewModel';

const { width, height } = Dimensions.get('window');

export const RewardsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { available: rewards, userRewards, isLoading, error } = useAppSelector((state) => state.rewards);
  const { balance } = useAppSelector((state) => state.points);
  const { user } = useAppSelector((state) => state.auth);
  const vm = featureToggles.useAdvancedRewards ? useRewardsViewModel() : null;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showRewardDetail, setShowRewardDetail] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemedRewardData, setRedeemedRewardData] = useState<any>(null);
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
        dispatch(fetchRewards()),
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

  const handleRedeemReward = async (reward: Reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const handleImageLoadStart = (rewardId: string) => {
    setImageLoading(prev => ({ ...prev, [rewardId]: true }));
    setImageError(prev => ({ ...prev, [rewardId]: false }));
  };

  const handleImageLoadEnd = (rewardId: string) => {
    setImageLoading(prev => ({ ...prev, [rewardId]: false }));
  };

  const handleImageError = (rewardId: string) => {
    setImageLoading(prev => ({ ...prev, [rewardId]: false }));
    setImageError(prev => ({ ...prev, [rewardId]: true }));
  };

  const getFallbackImage = (category: string) => {
    // URLs de respaldo más confiables
    const fallbackImages = {
      entertainment: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop&auto=format',
      food: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&auto=format',
      shopping: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop&auto=format',
      gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&auto=format',
      education: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&auto=format',
      other: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop&auto=format',
    };
    return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.other;
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    // Verificar si es usuario demo
    const isDemoUser = user?.subscriptionStatus === 'demo';
    
    if (isDemoUser) {
      setShowRedeemModal(false);
      Alert.alert(
        'Función Premium',
        'Los premios canjeables están disponibles solo para usuarios suscritos. ¡Suscríbete para acceder a premios reales!',
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
      setShowRedeemModal(false);
      
      const result = await dispatch(redeemReward(selectedReward.id)).unwrap();
      
      setRedeemedRewardData({
        reward: result.reward,
        userReward: result.userReward,
        pointsSpent: result.pointsSpent,
      });
      setShowSuccessModal(true);
      
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo canjear el premio');
    }
  };

  const handleRewardDetail = (reward: Reward) => {
    setSelectedReward(reward);
    setShowRewardDetail(true);
  };

  const handleMarkAsUsed = async (userRewardId: string) => {
    try {
      await dispatch(markRewardAsUsed(userRewardId)).unwrap();
      Alert.alert('Éxito', 'Premio marcado como utilizado');
    } catch (error: any) {
      Alert.alert('Error', error || 'No se pudo marcar el premio como utilizado');
    }
  };

  const canRedeemReward = (reward: Reward) => {
    const userBalance = balance.real || balance.demo || 0;
    return reward.isActive && 
           reward.stock > 0 && 
           userBalance >= reward.pointsRequired;
  };

  const getRewardStatus = (reward: Reward) => {
    if (!reward.isActive) return 'inactivo';
    if (reward.stock <= 0) return 'agotado';
    return 'disponible';
  };

  const getRewardStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return '#10b981';
      case 'agotado': return '#f59e0b';
      case 'inactivo': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRewardStatusText = (status: string) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'agotado': return 'Agotado';
      case 'inactivo': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const getMissingPoints = (reward: Reward) => {
    const userBalance = balance.real || balance.demo || 0;
    return Math.max(0, reward.pointsRequired - userBalance);
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

  const categories = [
    { key: 'all', label: 'Todos', icon: 'grid-outline' },
    { key: 'entertainment', label: 'Entretenimiento', icon: 'film' },
    { key: 'food', label: 'Comida', icon: 'restaurant' },
    { key: 'shopping', label: 'Compras', icon: 'bag' },
    { key: 'gaming', label: 'Gaming', icon: 'game-controller' },
    { key: 'education', label: 'Educación', icon: 'school' },
  ];

  const dataSource = vm ? vm.available : rewards;
  const filteredRewards = selectedCategory === 'all' 
    ? dataSource 
    : dataSource.filter((reward: Reward) => reward.category === selectedCategory);

  const renderReward = ({ item, index }: { item: Reward; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Card style={styles.rewardCard}>
        <LinearGradient
          colors={getRewardColor(item.category) as [string, string, string]}
          style={styles.rewardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Imagen del premio */}
          <View style={styles.rewardImageContainer}>
            <Image
              source={{ 
                uri: imageError[item.id] ? getFallbackImage(item.category) : item.image 
              }}
              style={styles.rewardImage}
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
            <View style={styles.rewardImageOverlay}>
              <View style={styles.rewardHeader}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons 
                    name={getRewardIcon(item.category) as any} 
                    size={24} 
                    color="#fff" 
                  />
                </View>
                <View style={styles.rewardPoints}>
                  <Text style={styles.rewardPointsText}>{item.pointsRequired}</Text>
                  <Text style={styles.rewardPointsLabel}>puntos</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.rewardContent}>
            <TouchableOpacity onPress={() => handleRewardDetail(item)}>
              <Text style={styles.rewardTitle}>{item.name}</Text>
              <Text style={styles.rewardDescription}>{item.description}</Text>
            </TouchableOpacity>
          
          <View style={styles.rewardFooter}>
            <View style={styles.rewardCategory}>
              <Text style={styles.rewardCategoryText}>
                {categories.find(cat => cat.key === item.category)?.label}
              </Text>
            </View>
            
            <View style={styles.stockInfo}>
              <Text style={styles.stockText}>
                Stock: {item.stock} disponible{item.stock !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.redeemButton,
              (balance.total < item.pointsRequired || item.stock <= 0) && styles.redeemButtonDisabled
            ]}
            onPress={() => handleRedeemReward(item)}
            disabled={balance.total < item.pointsRequired || item.stock <= 0}
          >
            <LinearGradient
              colors={balance.total >= item.pointsRequired && item.stock > 0
                ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'] 
                : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
              }
              style={styles.redeemButtonGradient}
            >
              <Ionicons 
                name="gift-outline" 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.redeemButtonText}>
                {item.stock <= 0 ? 'Agotado' :
                 balance.total >= item.pointsRequired ? 'Canjear' : 'Puntos Insuficientes'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

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
              <Text style={[getVariantStyle('h1'), styles.title]}>Premios</Text>
              <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>Canjea tus puntos</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Demo Banner */}
      {user?.subscriptionStatus === 'demo' && (
        <DemoRestrictionBanner type="rewards" />
      )}

      {/* Categories Filter */}
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
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.filterButton,
                selectedCategory === category.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <LinearGradient
                colors={
                  selectedCategory === category.key 
                    ? ['#667eea', '#764ba2'] 
                    : ['#f8f9fa', '#e9ecef']
                }
                style={styles.filterButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.key ? '#fff' : '#6c757d'}
                />
                <Text style={[
                  styles.filterButtonText,
                  selectedCategory === category.key && styles.filterButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Rewards List */}
      <FlatList
        data={filteredRewards}
        renderItem={renderReward}
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
            <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No hay premios disponibles</Text>
            <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
              ¡Juega más trivia para desbloquear premios increíbles!
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

      {/* Modal de confirmación de canje */}
      <Modal
        visible={showRedeemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalGradient}
            >
              <Text style={[getVariantStyle('h2'), styles.modalTitle]}>Confirmar Canje</Text>
              {selectedReward && (
                <>
                  <Text style={styles.modalRewardName}>{selectedReward.name}</Text>
                  <Text style={styles.modalRewardDescription}>{selectedReward.description}</Text>
                  <View style={styles.modalPointsInfo}>
                    <Ionicons name="wallet-outline" size={20} color="#fff" />
                    <Text style={styles.modalPointsText}>
                      Costo: {selectedReward.pointsRequired} puntos
                    </Text>
                  </View>
                  <Text style={styles.modalBalanceText}>
                    Tu balance: {balance.total} puntos
                  </Text>
                </>
              )}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowRedeemModal(false)}
                >
                  <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={confirmRedeem}
                >
                  <Text style={styles.modalButtonConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles del premio */}
      <Modal
        visible={showRewardDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRewardDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedReward && (
              <LinearGradient
                colors={getRewardColor(selectedReward.category) as [string, string, string]}
                style={styles.detailModalGradient}
              >
                {/* Imagen del premio en el modal */}
                <View style={styles.detailModalImageContainer}>
                  <Image
                    source={{ 
                      uri: imageError[`modal-${selectedReward.id}`] 
                        ? getFallbackImage(selectedReward.category) 
                        : selectedReward.image 
                    }}
                    style={styles.detailModalImage}
                    resizeMode="cover"
                    onLoadStart={() => handleImageLoadStart(`modal-${selectedReward.id}`)}
                    onLoadEnd={() => handleImageLoadEnd(`modal-${selectedReward.id}`)}
                    onError={() => handleImageError(`modal-${selectedReward.id}`)}
                  />
                  {imageLoading[`modal-${selectedReward.id}`] && (
                    <View style={styles.imageLoadingContainer}>
                      <Ionicons name="sync" size={32} color="#fff" />
                    </View>
                  )}
                  <View style={styles.detailModalImageOverlay}>
                    <View style={styles.detailModalHeader}>
                      <Text style={[getVariantStyle('h2'), styles.detailModalTitle]}>{selectedReward.name}</Text>
                      <TouchableOpacity
                        onPress={() => setShowRewardDetail(false)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailModalContent}>
                  <Text style={styles.detailModalDescription}>{selectedReward.description}</Text>
                
                <View style={styles.detailModalInfo}>
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="wallet-outline" size={16} color="#fff" />
                    <Text style={styles.detailInfoText}>
                      {selectedReward.pointsRequired} puntos
                    </Text>
                  </View>
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="cube-outline" size={16} color="#fff" />
                    <Text style={styles.detailInfoText}>
                      Stock: {selectedReward.stock} disponible{selectedReward.stock !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {selectedReward.expirationDate && (
                    <View style={styles.detailInfoItem}>
                      <Ionicons name="calendar-outline" size={16} color="#fff" />
                      <Text style={styles.detailInfoText}>
                        Válido hasta: {new Date(selectedReward.expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.detailModalInstructions}>
                  <Text style={[getVariantStyle('h2'), styles.instructionsTitle]}>Instrucciones de canje:</Text>
                  <Text style={styles.instructionsText}>{selectedReward.redemptionInstructions}</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.detailRedeemButton,
                    (balance.total < selectedReward.pointsRequired || selectedReward.stock <= 0) && 
                    styles.detailRedeemButtonDisabled
                  ]}
                  onPress={() => {
                    setShowRewardDetail(false);
                    handleRedeemReward(selectedReward);
                  }}
                  disabled={balance.total < selectedReward.pointsRequired || selectedReward.stock <= 0}
                >
                  <Text style={styles.detailRedeemButtonText}>
                    {selectedReward.stock <= 0 ? 'Agotado' :
                     balance.total >= selectedReward.pointsRequired ? 'Canjear Premio' : 'Puntos Insuficientes'}
                  </Text>
                </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Premio Canjeado Exitosamente */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <LinearGradient
              colors={['#10B981', '#34D399', '#6EE7B7']}
              style={styles.successModalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.successModalHeaderContent}>
                <View style={styles.successModalTitleContainer}>
                  <Ionicons name="checkmark-circle" size={40} color="#fff" style={styles.successModalTitleIcon} />
                  <Text style={[getVariantStyle('h2'), styles.successModalTitle]}>🎉 ¡Premio Canjeado!</Text>
                </View>
              </View>
              <Text style={[getVariantStyle('subtitle'), styles.successModalSubtitle]}>¡Felicitaciones! Tu premio ha sido canjeado exitosamente</Text>
            </LinearGradient>

            <View style={styles.successModalContent}>
              {/* Animación del premio */}
              <View style={styles.successRewardAnimation}>
                <LinearGradient
                  colors={redeemedRewardData ? getRewardColor(redeemedRewardData.reward.category) : ['#F59E0B', '#FBBF24', '#FCD34D'] as any}
                  style={styles.successRewardCircle}
                >
                  <Ionicons 
                    name={redeemedRewardData ? getRewardIcon(redeemedRewardData.reward.category) : 'gift'} 
                    size={48} 
                    color="#fff" 
                  />
                </LinearGradient>
                <Text style={styles.successRewardName}>{redeemedRewardData?.reward.name}</Text>
                <Text style={styles.successRewardLabel}>Premio canjeado</Text>
              </View>

              {/* Información del canje */}
              <View style={styles.successRedeemInfo}>
                <View style={styles.successRedeemItem}>
                  <Ionicons name="wallet" size={20} color="#10B981" />
                  <Text style={styles.successRedeemText}>
                    Puntos gastados: {redeemedRewardData?.pointsSpent}
                  </Text>
                </View>
                <View style={styles.successRedeemItem}>
                  <Ionicons name="card" size={20} color="#F59E0B" />
                  <Text style={styles.successRedeemText}>
                    Código: {redeemedRewardData?.userReward.redemptionCode}
                  </Text>
                </View>
                <View style={styles.successRedeemItem}>
                  <Ionicons name="time" size={20} color="#667eea" />
                  <Text style={styles.successRedeemText}>
                    Canjeado el {new Date().toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Instrucciones de canje */}
              <View style={styles.successInstructionsSection}>
                <LinearGradient
                  colors={['#f0f9ff', '#e0f2fe']}
                  style={styles.successInstructionsGradient}
                >
                  <Ionicons name="bulb" size={24} color="#667eea" style={styles.successInstructionsIcon} />
                  <Text style={[getVariantStyle('h2'), styles.successInstructionsTitle]}>📋 Instrucciones de canje</Text>
                  <Text style={styles.successInstructionsText}>
                    {redeemedRewardData?.reward.redemptionInstructions}
                  </Text>
                </LinearGradient>
              </View>

              {/* Próximos pasos */}
              <View style={styles.successNextSteps}>
                <LinearGradient
                  colors={['#fef3c7', '#fde68a']}
                  style={styles.successNextStepsGradient}
                >
                  <Ionicons name="star" size={24} color="#F59E0B" style={styles.successNextStepsIcon} />
                  <Text style={[getVariantStyle('h2'), styles.successNextStepsTitle]}>¿Qué puedes hacer ahora?</Text>
                  <View style={styles.successNextStepsList}>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="list" size={16} color="#10B981" />
                      <Text style={styles.successNextStepText}>Ver todos tus premios canjeados</Text>
                    </View>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="game-controller" size={16} color="#F59E0B" />
                      <Text style={styles.successNextStepText}>Jugar más trivia para ganar puntos</Text>
                    </View>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="gift" size={16} color="#667eea" />
                      <Text style={styles.successNextStepText}>Canjear más premios increíbles</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.successModalFooter}>
              <TouchableOpacity
                style={styles.successViewRewardsButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('MyRewards' as never);
                }}
              >
                <LinearGradient
                  colors={['#667eea', '#8B5CF6']}
                  style={styles.successViewRewardsButtonGradient}
                >
                  <Ionicons name="list" size={20} color="#fff" style={styles.successViewRewardsButtonIcon} />
                  <Text style={styles.successViewRewardsButtonText}>Ver mis premios</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.successContinueButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  loadData();
                }}
              >
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  style={styles.successContinueButtonGradient}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" style={styles.successContinueButtonIcon} />
                  <Text style={styles.successContinueButtonText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    padding: 0,
  },
  rewardImageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  rewardImage: {
    width: '100%',
    height: '100%',
  },
  rewardImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  rewardContent: {
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
  rewardPoints: {
    alignItems: 'center',
  },
  rewardPointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardPointsLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
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
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  redeemButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  redeemButtonDisabled: {
    opacity: 0.6,
  },
  redeemButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  redeemButtonText: {
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
    paddingHorizontal: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalRewardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalRewardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalPointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  modalBalanceText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  modalButtonCancelText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonConfirmText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
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
  detailModalContentWrapper: {
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
  detailModalInstructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
  },
  detailRedeemButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailRedeemButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailRedeemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos del Modal de Premio Canjeado Exitosamente
  successModalContainer: {
    width: '92%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  successModalHeader: {
    padding: 24,
    position: 'relative',
  },
  successModalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  successModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  successModalTitleIcon: {
    marginRight: 12,
  },
  successModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  successModalSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  successModalContent: {
    padding: 24,
  },
  successRewardAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successRewardCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successRewardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  successRewardLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  successRedeemInfo: {
    marginBottom: 32,
    gap: 16,
  },
  successRedeemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successRedeemText: {
    fontSize: 16,
    color: '#2d3748',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  successInstructionsSection: {
    marginBottom: 32,
  },
  successInstructionsGradient: {
    padding: 24,
    borderRadius: 16,
  },
  successInstructionsIcon: {
    marginBottom: 12,
  },
  successInstructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  successInstructionsText: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
  },
  successNextSteps: {
    marginBottom: 24,
  },
  successNextStepsGradient: {
    padding: 24,
    borderRadius: 16,
  },
  successNextStepsIcon: {
    marginBottom: 12,
  },
  successNextStepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  successNextStepsList: {
    gap: 12,
  },
  successNextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successNextStepText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  successModalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
    gap: 16,
  },
  successViewRewardsButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  successViewRewardsButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  successViewRewardsButtonIcon: {
    marginRight: 8,
  },
  successViewRewardsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  successContinueButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  successContinueButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  successContinueButtonIcon: {
    marginRight: 8,
  },
  successContinueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
