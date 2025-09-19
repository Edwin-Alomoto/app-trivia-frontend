import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

import { modeSelectionStyles } from '../styles/modeSelectionStyles';
import { useAppDispatch } from '../../../../shared/domain/hooks/useAppDispatch';
import { useAppSelector } from '../../../../shared/domain/hooks/useAppSelector';
import { activateDemoMode, activateSubscription } from '../../domain/store/authSlice';

type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

const { width: _width, height: _height } = Dimensions.get('window');

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
    <SafeAreaView style={modeSelectionStyles.container}>
      {/* Fondo con blobs orgánicos tenues */}
      <View pointerEvents="none" style={modeSelectionStyles.backgroundLayer}>
        <View style={modeSelectionStyles.blobTop} />
        <View style={modeSelectionStyles.blobCenter} />
        <View style={modeSelectionStyles.blobBottom} />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <ScrollView
        contentContainerStyle={modeSelectionStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header minimalista */}
        <Animated.View
          style={[
            modeSelectionStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={modeSelectionStyles.logoContainer}>
            <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }, modeSelectionStyles.marginBottom8]}>¡Hola, {user?.name}!</Text>
            <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>Elige cómo quieres empezar</Text>
          </View>
        </Animated.View>

        {/* Tarjetas de selección */}
        <Animated.View
          style={[
            modeSelectionStyles.cardsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Tarjeta Modo Demo */}
          <Animated.View
            style={[
              modeSelectionStyles.cardWrapper,
              {
                transform: [{ scale: cardAnimDemo }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                modeSelectionStyles.modeCard,
                selectedMode === 'demo' && modeSelectionStyles.modeCardSelected,
              ]}
              onPress={() => handleModeSelection('demo')}
              activeOpacity={0.9}
            >
              <View style={modeSelectionStyles.modeCardContent}>
                <View style={modeSelectionStyles.modeIconContainer}>
                  <Ionicons name="play-circle" size={40} color="#6366f1" />
                </View>
                
                <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, modeSelectionStyles.centerText4]}>Modo Demo</Text>
                <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }, modeSelectionStyles.centerText20]}>Prueba gratis por 7 días</Text>
                
                <View style={modeSelectionStyles.featuresContainer}>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Puntos de prueba</Text>
                  </View>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                    <Text style={[modeSelectionStyles.featureText, modeSelectionStyles.featureDisabled]}>Premios y sorteos</Text>
                  </View>
                </View>
                
                <View style={modeSelectionStyles.demoBadge}>
                  <Text style={[getVariantStyle('caption'), modeSelectionStyles.demoBadgeText]}>GRATIS</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Tarjeta Suscripción */}
          <Animated.View
            style={[
              modeSelectionStyles.cardWrapper,
              {
                transform: [{ scale: cardAnimSub }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                modeSelectionStyles.modeCard,
                modeSelectionStyles.premiumCard,
                selectedMode === 'subscription' && modeSelectionStyles.modeCardSelected,
              ]}
              onPress={() => handleModeSelection('subscription')}
              activeOpacity={0.9}
            >
              <View style={modeSelectionStyles.modeCardContent}>
                <View style={modeSelectionStyles.modeIconContainer}>
                  <Ionicons name="diamond" size={40} color="#10b981" />
                </View>
                
                <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, modeSelectionStyles.centerText4]}>Suscripción Premium</Text>
                <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }, modeSelectionStyles.centerText20]}>Acceso completo mensual</Text>
                
                <View style={modeSelectionStyles.featuresContainer}>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Puntos canjeables</Text>
                  </View>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Premios y sorteos</Text>
                  </View>
                  <View style={modeSelectionStyles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.featureText}>Encuestas exclusivas</Text>
                  </View>
                </View>
                
                <View style={modeSelectionStyles.priceBadge}>
                  <Text style={[getVariantStyle('body'), modeSelectionStyles.priceBadgeText]}>$9.99/mes</Text>
                  <Text style={[getVariantStyle('caption'), modeSelectionStyles.priceBadgeSubtext]}>Renovable mensualmente</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Información adicional */}
        <Animated.View
          style={[
            modeSelectionStyles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={modeSelectionStyles.infoCard}>
            <View style={modeSelectionStyles.infoHeader}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={[getVariantStyle('h2'), { color: colors.textPrimary }, modeSelectionStyles.marginLeft10]}>¿Por qué suscribirte?</Text>
            </View>
            <Text style={[getVariantStyle('body'), { color: colors.textSecondary }, modeSelectionStyles.lineHeight20]}>
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
        <View style={modeSelectionStyles.modalOverlay}>
          <View style={modeSelectionStyles.demoModal}>
            <View style={modeSelectionStyles.demoModalHeader}>
              <Ionicons name="play-circle" size={40} color="#6366f1" />
              <Text style={modeSelectionStyles.demoModalTitle}>Modo Demo</Text>
              <Text style={modeSelectionStyles.demoModalSubtitle}>
                ¡Perfecto para conocer la aplicación!
              </Text>
            </View>

            <View style={modeSelectionStyles.demoModalContent}>
              <View style={modeSelectionStyles.demoFeatures}>
                <Text style={modeSelectionStyles.demoFeaturesTitle}>Durante los próximos 7 días podrás:</Text>
                
                <View style={modeSelectionStyles.demoFeaturesList}>
                  <View style={modeSelectionStyles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.demoFeatureText}>Jugar trivia ilimitada</Text>
                  </View>
                  <View style={modeSelectionStyles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.demoFeatureText}>Acumular puntos de prueba</Text>
                  </View>
                  <View style={modeSelectionStyles.demoFeatureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.demoFeatureText}>Explorar todas las categorías</Text>
                  </View>
                </View>

                <View style={modeSelectionStyles.demoWarning}>
                  <Ionicons name="warning" size={18} color="#f59e0b" />
                  <Text style={modeSelectionStyles.demoWarningText}>
                    Los puntos demo no son canjeables. Suscríbete antes de que expire 
                    para convertirlos en puntos reales.
                  </Text>
                </View>
              </View>

              <View style={modeSelectionStyles.demoActions}>
                <TouchableOpacity
                  style={modeSelectionStyles.demoCancelButton}
                  onPress={() => setShowDemoModal(false)}
                >
                  <Text style={modeSelectionStyles.demoCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={modeSelectionStyles.demoConfirmButton}
                  onPress={handleConfirmDemo}
                  disabled={isLoading}
                >
                  <Ionicons name="play" size={18} color="#fff" />
                  <Text style={modeSelectionStyles.demoConfirmButtonText}>
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
        <View style={modeSelectionStyles.modalOverlay}>
          <View style={modeSelectionStyles.subscriptionModal}>
            <View style={modeSelectionStyles.subscriptionModalHeader}>
              <Ionicons name="diamond" size={40} color="#10b981" />
              <Text style={modeSelectionStyles.subscriptionModalTitle}>Suscripción Premium</Text>
              <Text style={modeSelectionStyles.subscriptionModalSubtitle}>
                Acceso completo mensual renovable
              </Text>
            </View>

            <View style={modeSelectionStyles.subscriptionModalContent}>
              <View style={modeSelectionStyles.subscriptionFeatures}>
                <Text style={modeSelectionStyles.subscriptionFeaturesTitle}>Con Premium obtienes:</Text>
                
                <View style={modeSelectionStyles.subscriptionFeaturesList}>
                  <View style={modeSelectionStyles.subscriptionFeatureItem}>
                    <Ionicons name="infinite" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.subscriptionFeatureText}>Trivia ilimitada</Text>
                  </View>
                  <View style={modeSelectionStyles.subscriptionFeatureItem}>
                    <Ionicons name="diamond" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.subscriptionFeatureText}>Puntos canjeables</Text>
                  </View>
                  <View style={modeSelectionStyles.subscriptionFeatureItem}>
                    <Ionicons name="gift" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.subscriptionFeatureText}>Premios reales</Text>
                  </View>
                  <View style={modeSelectionStyles.subscriptionFeatureItem}>
                    <Ionicons name="trophy" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.subscriptionFeatureText}>Sorteos exclusivos</Text>
                  </View>
                  <View style={modeSelectionStyles.subscriptionFeatureItem}>
                    <Ionicons name="chatbubbles" size={18} color="#10b981" />
                    <Text style={modeSelectionStyles.subscriptionFeatureText}>Encuestas premium</Text>
                  </View>
                </View>

                <View style={modeSelectionStyles.subscriptionPrice}>
                  <View style={modeSelectionStyles.subscriptionPriceRow}>
                    <Text style={modeSelectionStyles.subscriptionPriceAmount}>$9.99</Text>
                    <Text style={modeSelectionStyles.subscriptionPricePeriod}>por mes</Text>
                  </View>
                  <Text style={modeSelectionStyles.subscriptionPriceRenewal}>Renovación automática mensual</Text>
                </View>
              </View>

              <View style={modeSelectionStyles.subscriptionActions}>
                <TouchableOpacity
                  style={modeSelectionStyles.subscriptionCancelButton}
                  onPress={() => setShowSubscriptionModal(false)}
                >
                  <Text style={modeSelectionStyles.subscriptionCancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={modeSelectionStyles.subscriptionConfirmButton}
                  onPress={handleConfirmSubscription}
                  disabled={isLoading}
                >
                  <Ionicons name="diamond" size={18} color="#fff" />
                  <Text style={modeSelectionStyles.subscriptionConfirmButtonText}>
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