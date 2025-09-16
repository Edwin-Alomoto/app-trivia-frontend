import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { RootStackParamList } from '@shared/domain/types';

import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { activateDemoMode, activateSubscription } from '../../domain/store/authSlice';



type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

const { width, height } = Dimensions.get('window');

export const ModeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ModeSelectionScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Estados de selección
  const [selectedMode, setSelectedMode] = useState<'demo' | 'subscription' | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const cardAnimDemo = useState(new Animated.Value(1))[0];
  const cardAnimSub = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Animaciones de entrada suaves
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [ fadeAnim, slideAnim, scaleAnim]);

  const animateCard = (mode: 'demo' | 'subscription') => {
    const anim = mode === 'demo' ? cardAnimDemo : cardAnimSub;
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleModeSelection = (mode: 'demo' | 'subscription') => {
    setSelectedMode(mode);
    animateCard(mode);
    Haptics.selectionAsync();
    
    if (mode === 'demo') {
      setShowDemoModal(true);
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const handleConfirmDemo = async () => {
    setIsLoading(true);
    setShowDemoModal(false);
    
    try {
      await dispatch(activateDemoMode()).unwrap();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '¡Modo Demo Activado!',
        'Tienes 7 días para probar todas las funciones. Tus puntos se convertirán en canjeables al suscribirte.',
        [
          {
            text: '¡Empezar!',
            onPress: () => navigation.navigate('MainTabs' as never)
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo activar el modo demo. Inténtalo de nuevo.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSubscription = async () => {
    setIsLoading(true);
    setShowSubscriptionModal(false);
    
    try {
      await dispatch(activateSubscription()).unwrap();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '¡Suscripción Premium Exitosa!',
        'Tu suscripción mensual de $9.99 USD está activa. Se renovará automáticamente cada mes. Ahora tienes acceso completo a todas las funciones de WinUp.',
        [
          {
            text: '¡Empezar!',
            onPress: () => navigation.navigate('MainTabs' as never)
          }
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Error de Suscripción',
        'No pudimos procesar la suscripción. Inténtalo de nuevo o contacta soporte.',
        [
          {
            text: 'Reintentar',
            onPress: () => setShowSubscriptionModal(true)
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={styles.blobTop} />
        <View style={styles.blobCenter} />
        <View style={styles.blobBottom} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header minimalista */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }, styles.marginBottom8]}>¡Hola, {user?.name}!</Text>
            <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Elige cómo quieres empezar</Text>
          </View>
        </Animated.View>

        {/* Tarjetas de selección */}
        <Animated.View
          style={[
            styles.cardsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Tarjeta Modo Demo */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                transform: [{ scale: cardAnimDemo }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modeCard,
                selectedMode === 'demo' && styles.modeCardSelected,
              ]}
              onPress={() => handleModeSelection('demo')}
              activeOpacity={0.9}
            >
              <View style={styles.modeCardContent}>
                <View style={styles.modeIconContainer}>
                  <Ionicons name="play-circle" size={40} color="#6366f1" />
                </View>
                
                <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, styles.centerText4]}>Modo Demo</Text>
                <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }, styles.centerText20]}>Prueba gratis por 7 días</Text>
                
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Puntos de prueba</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                    <Text style={[styles.featureText, styles.featureDisabled]}>Premios y sorteos</Text>
                  </View>
                </View>
                
                <View style={styles.demoBadge}>
                  <Text style={[getVariantStyle('caption'), styles.demoBadgeText]}>GRATIS</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Tarjeta Suscripción */}
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                transform: [{ scale: cardAnimSub }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modeCard,
                styles.premiumCard,
                selectedMode === 'subscription' && styles.modeCardSelected,
              ]}
              onPress={() => handleModeSelection('subscription')}
              activeOpacity={0.9}
            >
              <View style={styles.modeCardContent}>
                <View style={styles.modeIconContainer}>
                  <Ionicons name="diamond" size={40} color="#10b981" />
                </View>
                
                <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, styles.centerText4]}>Suscripción Premium</Text>
                <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }, styles.centerText20]}>Acceso completo mensual</Text>
                
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Puntos canjeables</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Premios y sorteos</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.featureText}>Encuestas exclusivas</Text>
                  </View>
                </View>
                
                <View style={styles.priceBadge}>
                  <Text style={[getVariantStyle('body'), styles.priceBadgeText]}>$9.99/mes</Text>
                  <Text style={[getVariantStyle('caption'), styles.priceBadgeSubtext]}>Renovable mensualmente</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Información adicional */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, styles.marginLeft10]}>¿Por qué suscribirte?</Text>
            </View>
            <Text style={[getVariantStyle('body'), { color: colors.textSecondary }, styles.lineHeight20]}>
              Con la suscripción Premium obtienes acceso completo a todas las funciones, 
              puntos canjeables por premios reales y participación en sorteos exclusivos. 
              La suscripción se renueva automáticamente cada mes por $9.99 USD.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modal de confirmación Modo Demo */}
      <Modal
        visible={showDemoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDemoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.demoModal}>
            <View style={styles.demoModalHeader}>
              <Ionicons name="play-circle" size={40} color="#6366f1" />
              <Text style={styles.demoModalTitle}>Modo Demo</Text>
              <Text style={styles.demoModalSubtitle}>
                ¡Perfecto para conocer la aplicación!
              </Text>
            </View>

            <View style={styles.demoModalContent}>
              <View style={styles.demoFeatures}>
                <Text style={styles.demoFeaturesTitle}>Durante los próximos 7 días podrás:</Text>
                
                <View style={styles.demoFeaturesList}>
                  <View style={styles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.demoFeatureText}>Jugar trivia ilimitada</Text>
                  </View>
                  <View style={styles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.demoFeatureText}>Acumular puntos de prueba</Text>
                  </View>
                  <View style={styles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={styles.demoFeatureText}>Explorar todas las categorías</Text>
                  </View>
                </View>

                <View style={styles.demoWarning}>
                  <Ionicons name="warning" size={18} color="#f59e0b" />
                  <Text style={styles.demoWarningText}>
                    Los puntos demo no son canjeables. Suscríbete antes de que expire 
                    para convertirlos en puntos reales.
                  </Text>
                </View>
              </View>

              <View style={styles.demoActions}>
                <TouchableOpacity
                  style={styles.demoCancelButton}
                  onPress={() => setShowDemoModal(false)}
                >
                  <Text style={styles.demoCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.demoConfirmButton}
                  onPress={handleConfirmDemo}
                  disabled={isLoading}
                >
                  <Ionicons name="play" size={18} color="#fff" />
                  <Text style={styles.demoConfirmButtonText}>
                    {isLoading ? 'Activando...' : 'Empezar Demo'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación Suscripción */}
      <Modal
        visible={showSubscriptionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.subscriptionModal}>
            <View style={styles.subscriptionModalHeader}>
              <Ionicons name="diamond" size={40} color="#10b981" />
              <Text style={styles.subscriptionModalTitle}>Suscripción Premium</Text>
              <Text style={styles.subscriptionModalSubtitle}>
                Acceso completo mensual renovable
              </Text>
            </View>

            <View style={styles.subscriptionModalContent}>
              <View style={styles.subscriptionFeatures}>
                <Text style={styles.subscriptionFeaturesTitle}>Con Premium obtienes:</Text>
                
                <View style={styles.subscriptionFeaturesList}>
                  <View style={styles.subscriptionFeatureItem}>
                    <Ionicons name="infinite" size={18} color="#10b981" />
                    <Text style={styles.subscriptionFeatureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={styles.subscriptionFeatureItem}>
                    <Ionicons name="diamond" size={18} color="#10b981" />
                    <Text style={styles.subscriptionFeatureText}>Puntos canjeables</Text>
                  </View>
                  <View style={styles.subscriptionFeatureItem}>
                    <Ionicons name="gift" size={18} color="#10b981" />
                    <Text style={styles.subscriptionFeatureText}>Premios reales</Text>
                  </View>
                  <View style={styles.subscriptionFeatureItem}>
                    <Ionicons name="trophy" size={18} color="#10b981" />
                    <Text style={styles.subscriptionFeatureText}>Sorteos exclusivos</Text>
                  </View>
                  <View style={styles.subscriptionFeatureItem}>
                    <Ionicons name="chatbubbles" size={18} color="#10b981" />
                    <Text style={styles.subscriptionFeatureText}>Encuestas premium</Text>
                  </View>
                </View>

                <View style={styles.subscriptionPrice}>
                  <View style={styles.subscriptionPriceRow}>
                    <Text style={styles.subscriptionPriceAmount}>$9.99</Text>
                    <Text style={styles.subscriptionPricePeriod}>por mes</Text>
                  </View>
                  <Text style={styles.subscriptionPriceRenewal}>Renovación automática mensual</Text>
                </View>
              </View>

              <View style={styles.subscriptionActions}>
                <TouchableOpacity
                  style={styles.subscriptionCancelButton}
                  onPress={() => setShowSubscriptionModal(false)}
                >
                  <Text style={styles.subscriptionCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.subscriptionConfirmButton}
                  onPress={handleConfirmSubscription}
                  disabled={isLoading}
                >
                  <Ionicons name="diamond" size={18} color="#fff" />
                  <Text style={styles.subscriptionConfirmButtonText}>
                    {isLoading ? 'Procesando...' : 'Suscribirme'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: colors.surface,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blobTop: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    top: -width * 0.4,
    left: -width * 0.3,
    backgroundColor: 'rgba(210, 180, 254, 0.06)',
  },
  blobCenter: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    top: height * 0.18,
    alignSelf: 'center',
    backgroundColor: 'rgba(230, 213, 255, 0.04)',
  },
  blobBottom: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: (width * 1.4) / 2,
    bottom: -width * 0.6,
    right: -width * 0.4,
    backgroundColor: 'rgba(230, 213, 255, 0.04)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  premiumCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#e0f2fe',
  },
  modeCardSelected: {
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderColor: '#6366f1',
    borderWidth: 2,
  },
  modeCardContent: {
    alignItems: 'center',
    position: 'relative',
  },
  modeIconContainer: {
    backgroundColor: '#ffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  modeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
    fontWeight: '500',
  },
  featureDisabled: {
    opacity: 0.6,
  },
  demoBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    position: 'absolute',
    top: -8,
    right: -8,
  },
  demoBadgeText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  priceBadgeText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceBadgeSubtext: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  // Estilos de modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  demoModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  demoModalHeader: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  demoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 6,
  },
  demoModalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  demoModalContent: {
    padding: 24,
  },
  demoFeatures: {
    marginBottom: 24,
  },
  demoFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  demoFeaturesList: {
    marginBottom: 20,
  },
  demoFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoFeatureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
  },
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  demoWarningText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 10,
    flex: 1,
    lineHeight: 16,
  },
  demoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  demoCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  demoCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  demoConfirmButton: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#6366f1',
  },
  demoConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
  // Estilos modal suscripción
  subscriptionModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  subscriptionModalHeader: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
  },
  subscriptionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 6,
  },
  subscriptionModalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  subscriptionModalContent: {
    padding: 24,
  },
  subscriptionFeatures: {
    marginBottom: 24,
  },
  subscriptionFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  subscriptionFeaturesList: {
    marginBottom: 20,
  },
  subscriptionFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subscriptionFeatureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 10,
  },
  subscriptionPrice: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  subscriptionPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  subscriptionPriceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
  },
  subscriptionPricePeriod: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  subscriptionPriceRenewal: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  subscriptionCancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  subscriptionCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  subscriptionConfirmButton: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
  },
  subscriptionConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  centerText4: {
    textAlign: 'center',
    marginBottom: 4,
  },
  centerText20: {
    textAlign: 'center',
    marginBottom: 20,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  lineHeight20: {
    lineHeight: 20,
  },
});
