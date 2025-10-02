import React, { useEffect, useState } from "react";
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@theme/gradients";
import { getVariantStyle } from "@theme/typography";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAppNavigation } from "@app/navigation/types";
import { featureToggles } from "@config/featureToggles";

import { useHomeViewModel } from "../../domain/hooks/useHomeViewModel";
import { Card } from "@shared/presentation/components/ui/Card";
import { DemoRestrictionBanner } from "@shared/presentation/components/ui/DemoRestrictionBanner";
import { DemoExpirationBanner } from "@shared/presentation/components/ui/DemoExpirationBanner";
import { useAppDispatch } from "@shared/domain/hooks/useAppDispatch";
import { useAppSelector } from "@shared/domain/hooks/useAppSelector";
import { useDemoStatus } from "@shared/domain/hooks/useDemoStatus";
import { PointsCounter } from "@shared/presentation/animations/PointsCounter";
import { PointsParticles } from "@shared/presentation/animations/PointsParticles";
import { fetchPointBalance, fetchTransactions } from "@store/slices/pointsSlice";
import { fetchPackages, purchasePoints as purchasePointsFromPurchases } from "@store/slices/purchasesSlice";
import { selectPointPackages } from "@store/slices/purchasesSlice";
import { fetchNotifications } from "@store/slices/notificationsSlice";
import { fetchCategories } from "@store/slices/triviaSlice";
import { fetchRewards } from "@store/slices/rewardsSlice";
import { fetchRaffles } from "@store/slices/rafflesSlice";
import { fetchSurveys } from "@store/slices/surveysSlice";
import { CredibilityBanner } from "@shared/presentation/components/ui/CredibilityBanner";
import { PointPackage } from "@shared/domain/types";

import { Background } from "../../../../assets";

const { width, height } = Dimensions.get("window");
const CONTROL_HEIGHT = 52;

export const HomeScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();
  const { balance, isLoading: pointsLoading } = useAppSelector((state) => state.points);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { categories } = useAppSelector((state) => state.trivia);
  const { available: rewards } = useAppSelector((state) => state.rewards);
  const { active: raffles } = useAppSelector((state) => state.raffles);
  const { surveys } = useAppSelector((state) => state.surveys);
  const useAdvanced = featureToggles.useAdvancedHome;
  const vm = useAdvanced ? useHomeViewModel() : null;
  
  // Hook para estado del demo
  const demoCtx = useAdvanced ? vm!.demo : useDemoStatus();
  const {
    isDemoUser,
    isSubscribed,
    daysLeft,
    canRedeemRewards,
    canParticipateInRaffles,
    canViewRewards,
    canViewRaffles,
    subscriptionMessage,
  } = demoCtx;

  // Valores por defecto para evitar errores de undefined
  const safeRewards = useAdvanced ? vm!.safeRewards : (Array.isArray(rewards) ? rewards : []);
  const safeRaffles = useAdvanced ? vm!.safeRaffles : (Array.isArray(raffles) ? raffles : []);
  const safeCategories = useAdvanced ? vm!.safeCategories : (Array.isArray(categories) ? categories : []);
  const safeSurveys = useAdvanced ? vm!.safeSurveys : (Array.isArray(surveys) ? surveys : []);
  const safeUnreadCount = useAdvanced ? vm!.safeUnreadCount : (typeof unreadCount === 'number' ? unreadCount : 0);

  // Logs de depuración removidos para producción

  const [refreshing, setRefreshing] = React.useState(false);
  const [showPointsParticles, setShowPointsParticles] = useState(false);
  const [showBuyPointsModal, setShowBuyPointsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const purchasePackages: PointPackage[] = useAppSelector((selectPointPackages as unknown) as (state: any) => PointPackage[]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<{ number?: string; holder?: string; expiry?: string; cvv?: string }>({});
  const [touched, setTouched] = useState<{ number?: boolean; holder?: boolean; expiry?: boolean; cvv?: boolean }>({});
  const [showTriviaModal, setShowTriviaModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedPoints, setPurchasedPoints] = useState(0);
  const selectedPkg = React.useMemo(() => (
    purchasePackages.find((p: any) => p.id === selectedPackage) || null
  ), [purchasePackages, selectedPackage]);
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

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

    // Animación de pulso para elementos interactivos
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Actualizar datos cuando la pantalla regresa al foco
  useFocusEffect(
    React.useCallback(() => {
      // Recargar los puntos cuando se regresa a la pantalla
      if (useAdvanced) {
        vm!.refreshPoints();
      } else {
        dispatch(fetchPointBalance());
        dispatch(fetchTransactions());
      }
    }, [dispatch, useAdvanced, vm])
  );

  const loadData = async () => {
    try {
      if (useAdvanced) {
        await vm!.loadData();
      } else {
        await Promise.all([
          dispatch(fetchPointBalance()),
          dispatch(fetchTransactions()),
          dispatch(fetchPackages()),
          dispatch(fetchNotifications()),
          dispatch(fetchCategories()),
          dispatch(fetchRewards()),
          dispatch(fetchRaffles()),
          dispatch(fetchSurveys()),
        ]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePlayTrivia = () => {
    // Verificar si hay categorías disponibles
    if (!safeCategories || safeCategories.length === 0) {
      Alert.alert(
        "Sin categorías disponibles",
        "No hay categorías de trivia disponibles en este momento. Inténtalo más tarde.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    // Mostrar modal personalizado
    setShowTriviaModal(true);
  };

  const handleViewRewards = () => {
    if (!canViewRewards) {
      Alert.alert(
        "Acceso Restringido",
        "Esta función no está disponible para tu tipo de cuenta.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    try {
      navigation.navigate('Rewards' as never);
    } catch (error) {
      console.error('Error navegando a Rewards:', error);
      Alert.alert(
        "Error de navegación",
        "No se pudo abrir la sección de premios. Inténtalo de nuevo.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleViewRaffles = () => {
    if (!canViewRaffles) {
      Alert.alert(
        "Acceso Restringido",
        "Esta función no está disponible para tu tipo de cuenta.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    
    try {
      navigation.navigate('Raffles' as never);
    } catch (error) {
      console.error('Error navegando a Raffles:', error);
      Alert.alert(
        "Error de navegación",
        "No se pudo abrir la sección de sorteos. Inténtalo de nuevo.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleViewSurveys = () => {
    try {
      navigation.navigate('Surveys' as never);
    } catch (error) {
      console.error('Error navegando a Surveys:', error);
      Alert.alert(
        "Error de navegación",
        "No se pudo abrir la sección de encuestas. Inténtalo de nuevo.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleViewNotifications = () => {
    navigation.navigate("Notifications" as never);
  };

  const handleViewProfile = () => {
    navigation.navigate("Profile" as never);
  };

  const handleBuyPoints = () => {
    setShowBuyPointsModal(true);
    setSelectedPackage(null);
  };

  const handlePurchasePoints = async () => {
    if (!selectedPackage) {
      Alert.alert("Error", "Por favor selecciona un paquete de puntos");
      return;
    }

    // Mostrar formulario de pago
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async () => {
    // Validación centralizada con feedback en campos
    const errors = validateCard();
    if (Object.keys(errors).length > 0) {
      setTouched({ number: true, holder: true, expiry: true, cvv: true });
      return;
    }

    setIsPurchasing(true);
    try {
      await dispatch(purchasePointsFromPurchases(selectedPackage!)).unwrap();
      const packageData = purchasePackages.find((p: any) => p.id === selectedPackage);
      setPurchasedPoints(packageData?.points || 0);
      
      // Cerrar modal de compra y mostrar modal de éxito
      setShowBuyPointsModal(false);
      setSelectedPackage(null);
      setShowPaymentForm(false);
      setCardNumber('');
      setCardHolder('');
      setExpiryDate('');
      setCvv('');
      
      // Mostrar modal de éxito
      setShowSuccessModal(true);
      handlePointsAnimation();
    } catch (error) {
      Alert.alert("Error", "No se pudo completar la compra. Inténtalo de nuevo.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateCard = () => {
    const errors: { number?: string; holder?: string; expiry?: string; cvv?: string } = {};
    const numberDigits = cardNumber.replace(/\s/g, '');
    if (numberDigits.length < 16 || !/^\d{16}$/.test(numberDigits) || !luhnCheck(numberDigits)) {
      errors.number = 'Número de tarjeta inválido';
    }
    if (!cardHolder || cardHolder.trim().length < 5) {
      errors.holder = 'Nombre del titular inválido';
    }
    const [mm, yy] = expiryDate.split('/');
    const month = parseInt(mm as string, 10);
    const year = parseInt(yy as string, 10);
    if (!mm || !yy || month < 1 || month > 12 || (yy as string).length !== 2) {
      errors.expiry = 'Fecha inválida (MM/AA)';
    } else {
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'Tarjeta vencida';
      }
    }
    if (!/^\d{3}$/.test(cvv)) {
      errors.cvv = 'CVV inválido';
    }
    setCardErrors(errors);
    return errors;
  };


  const handleViewHistory = () => {
    navigation.navigate("PointsHistory" as never);
  };

  const handlePointsAnimation = () => {
    setShowPointsParticles(true);
  };

  const renderQuickActions = () => (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={[getVariantStyle('h2'), styles.sectionTitle]}>Comienza aquí</Text>
        <Text style={[getVariantStyle('subtitle'), styles.sectionSubtitle]}>¿Qué te gustaría hacer ahora?</Text>
      </View>

      <View style={styles.quickActionsGrid}>
        {/* Categorías de Trivia */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={handlePlayTrivia}
        >
          <LinearGradient
            colors={['#60A5FA', '#2563EB']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="game-controller" size={32} color="#fff" />
            <Text style={[getVariantStyle('body'), styles.quickActionTitle]}>Jugar trivia</Text>
            <Text style={[getVariantStyle('caption'), styles.quickActionSubtitle]}>
              {safeCategories.length} categorías disponibles
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Sorteos - Siempre visible */}
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            !canViewRaffles && styles.disabledCard
          ]}
          onPress={() => canViewRaffles ? handleViewRaffles() : null}
          disabled={!canViewRaffles}
        >
          <LinearGradient
            colors={['#FB7185', '#F43F5E']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="gift" size={32} color="#fff" />
            <Text style={[getVariantStyle('body'), styles.quickActionTitle]}>Sorteos</Text>
            <Text style={[getVariantStyle('caption'), styles.quickActionSubtitle]}>
              {safeRaffles.length} sorteos activos
            </Text>
            {isDemoUser && (
              <View style={styles.demoBadge}>
                <Text style={[getVariantStyle('caption'), styles.demoBadgeText]}>SOLO VER</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>



        {/* Premios - siempre visible */}
        <TouchableOpacity
          style={[
            styles.quickActionCard,
            !canViewRewards && styles.disabledCard
          ]}
          onPress={() => canViewRewards ? handleViewRewards() : null}
          disabled={!canViewRewards}
        >
          <LinearGradient
            colors={canViewRewards ? ['#16A34A', '#22C55E'] : ['#9ca3af', '#6b7280']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="star" size={32} color="#fff" />
            <Text style={[getVariantStyle('body'), styles.quickActionTitle]}>Premios</Text>
            <Text style={[getVariantStyle('caption'), styles.quickActionSubtitle]}>
              {safeRewards.length} premios disponibles
            </Text>
            {isDemoUser && (
              <View style={styles.demoBadge}>
                <Text style={[getVariantStyle('caption'), styles.demoBadgeText]}>SOLO VER</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Encuestas */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('Surveys' as never)}
        >
          <LinearGradient
            colors={['#F97316', '#F59E0B']}
            style={styles.quickActionGradient}
          >
            <Ionicons name="chatbubbles" size={32} color="#fff" />
            <Text style={[getVariantStyle('body'), styles.quickActionTitle]}>Encuestas</Text>
            <Text style={[getVariantStyle('caption'), styles.quickActionSubtitle]}>
              {safeSurveys.length} encuestas activas
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        

        
      </View>
    </Animated.View>
  );



  const renderStatsSection = () => (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={[getVariantStyle('h2'), styles.sectionTitle]}>Mis Estadísticas</Text>
        <Text style={[getVariantStyle('subtitle'), styles.sectionSubtitle]}>Tu progreso en la app</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="trophy" size={24} color="#fbbf24" />
            <Text style={[getVariantStyle('h2'), styles.statNumber]}>{safeCategories.length}</Text>
            <Text style={[getVariantStyle('caption'), styles.statLabel]}>Categorías Jugadas</Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="gift" size={24} color="#10b981" />
            <Text style={[getVariantStyle('h2'), styles.statNumber]}>{safeRaffles.length}</Text>
            <Text style={[getVariantStyle('caption'), styles.statLabel]}>Sorteos Activos</Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="star" size={24} color="#6366f1" />
            <Text style={[getVariantStyle('h2'), styles.statNumber]}>{safeRewards.length}</Text>
            <Text style={[getVariantStyle('caption'), styles.statLabel]}>Premios Disponibles</Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="chatbubbles" size={24} color="#f59e0b" />
            <Text style={[getVariantStyle('h2'), styles.statNumber]}>{safeSurveys.length}</Text>
            <Text style={[getVariantStyle('caption'), styles.statLabel]}>Encuestas Activas</Text>
          </View>
        </Card>
      </View>
    </Animated.View>
  );

  

  return (
    <ImageBackground source={Background} style={{ flex: 1, width: '100%', height: '100%' }} resizeMode="cover">
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[styles.scrollView, { paddingBottom: Math.max(insets.bottom + 80, 100) }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Unificado con Puntos */}
        <LinearGradient
          colors={['#efb810', '#d2be74']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.backgroundPattern}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />
          </View>
          
          <Animated.View 
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Sección superior: saludo + acciones */}
            <View style={styles.headerTopSection}>
              <View style={styles.userInfo}>
                <View style={styles.greetingContainer}>
                  <Text style={[getVariantStyle('h2'), styles.greeting]}>¡Hola, Alejandra!</Text>
                  <Text style={[getVariantStyle('body'), styles.subtitle]}>¡Comienza a ganar puntos!</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={handleViewNotifications}
                >
                  <Ionicons name="notifications-outline" size={24} color="#1f2937" />
                  {safeUnreadCount > 0 && (
                    <Animated.View 
                      style={[
                        styles.notificationBadge,
                        {
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    >
                      <Text style={styles.notificationBadgeText}>
                        {safeUnreadCount > 9 ? "9+" : safeUnreadCount}
                      </Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={handleViewProfile}
                >
                  <LinearGradient
                    colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                    style={styles.profileGradient}
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={32}
                      color="#1f2937"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sección inferior: puntos + progreso + acciones */}
            <View style={styles.pointsSection}>
              <View style={styles.pointsMainHeader}>
                <View style={styles.pointsMainInfo}>
                  <Text style={[getVariantStyle('caption'), styles.pointsMainTitle]}>Mis puntos acumulados</Text>
                  <View style={styles.pointsAmountContainer}>
                    <Text style={[getVariantStyle('h1'), styles.pointsMainAmount]}>
                      {balance.total.toLocaleString()}
                    </Text>
                    <View style={styles.pointsIconBadge}>
                      <LinearGradient
                        colors={["#6b46c1", "#5b21b6"]}
                        style={styles.pointsIconBadgeGradient}
                      >
                        <Ionicons name="star" size={16} color="#ffffff" />
                      </LinearGradient>
                    </View>
                  </View>
                  <Text style={[getVariantStyle('caption'), styles.pointsMainLabel]}>puntos</Text>
                </View>
              </View>


              {/* Botones de acción */}
              <View style={styles.pointsActionButtons}>
                <TouchableOpacity 
                  style={styles.pointsActionBtn}
                  onPress={() => {
                    handleBuyPoints();
                    handlePointsAnimation();
                  }}
                >
                  <LinearGradient
                    colors={["#10B981", "#34D399"]}
                    style={styles.pointsActionBtnGradient}
                  >
                    <Ionicons name="add-circle" size={18} color="#fff" />
                    <Text style={[getVariantStyle('body'), styles.pointsActionBtnText]}>Comprar</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.pointsActionBtn}
                  onPress={handleViewHistory}
                >
                  <LinearGradient
                    colors={["#8B5CF6", "#6366F1"]}
                    style={styles.pointsActionBtnGradient}
                  >
                    <Ionicons name="time" size={18} color="#fff" />
                    <Text style={[getVariantStyle('body'), styles.pointsActionBtnText]}>Historial</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Banner de Demo si aplica */}
        {isDemoUser && (
          <DemoRestrictionBanner type="rewards" />
        )}

        {/* Banner de Caducidad del Demo */}
        <DemoExpirationBanner 
          onSubscribe={() => navigation.navigate('ModeSelection' as never)}
        />

        {/* Banner de Credibilidad */}
        <CredibilityBanner type="testimonial" maxItems={2} showViewAll={true} />

        {renderQuickActions()}

        

        {renderStatsSection()}
      </ScrollView>

      {/* Modal de Trivia - Diseño Mejorado */}
      <Modal
        visible={showTriviaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTriviaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.triviaModalContainer}>
            <LinearGradient
              colors={gradients.brand as unknown as [string, string]}
              style={styles.triviaModalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.triviaModalHeaderContent}>
                <View style={styles.triviaModalTitleContainer}>
                  <Ionicons name="game-controller" size={32} color="#fff" style={styles.triviaModalTitleIcon} />
                  <Text style={[getVariantStyle('h2'), styles.triviaModalTitle]}>¡A jugar!</Text>
                </View>
                <TouchableOpacity
                  style={styles.triviaModalCloseButton}
                  onPress={() => setShowTriviaModal(false)}
                >
                  <Ionicons name="close-circle" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[getVariantStyle('subtitle'), styles.triviaModalSubtitle]}>¡Listo para poner a prueba tu conocimiento!</Text>
            </LinearGradient>

            <ScrollView style={styles.triviaModalContent} showsVerticalScrollIndicator={false}>
              {/* Sección de consejos */}
              <View style={styles.triviaTipsSection}>
                <View style={styles.triviaTipsHeader}>
                  <Ionicons name="bulb" size={24} color="#FBBF24" style={styles.triviaTipsIcon} />
                  <Text style={[getVariantStyle('h2'), styles.triviaTipsTitle]}>Consejos para ganar</Text>
                </View>
                
                <View style={styles.triviaTipsList}>
                  <View style={styles.triviaTipItem}>
                    <Ionicons name="flash" size={20} color="#10B981" />
                    <Text style={[getVariantStyle('body'), styles.triviaTipText]}>Responde rápido para ganar más puntos</Text>
                  </View>
                  
                  <View style={styles.triviaTipItem}>
                    <Ionicons name="help-circle" size={20} color="#667eea" />
                    <Text style={[getVariantStyle('body'), styles.triviaTipText]}>Usa las pistas sabiamente</Text>
                  </View>
                  <View style={styles.triviaTipItem}>
                    <Ionicons name="star" size={20} color="#FBBF24" />
                    <Text style={[getVariantStyle('body'), styles.triviaTipText]}>¡Cada respuesta cuenta!</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.triviaModalFooter}>
              <TouchableOpacity
                style={styles.triviaCancelButton}
                onPress={() => setShowTriviaModal(false)}
              >
                <Text style={[getVariantStyle('body'), styles.triviaCancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.triviaStartButton}
                onPress={() => {
                  setShowTriviaModal(false);
                  navigation.navigate("Categories" as never);
                }}
              >
                <LinearGradient
                  colors={['#6D28D9', '#8B5CF6']}
                  style={styles.triviaStartButtonGradient}
                >
                  <Ionicons name="play" size={20} color="#fff" style={styles.triviaStartButtonIcon} />
                  <Text style={[getVariantStyle('body'), styles.triviaStartButtonText]}>¡Empezar!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Compra Exitosa - Diseño Mejorado */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <LinearGradient
              colors={gradients.brand as unknown as [string, string]}
              style={styles.successModalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.successModalHeaderContent}>
                <View style={styles.successModalTitleContainer}>
                  <Ionicons name="checkmark-circle" size={40} color="#fff" style={styles.successModalTitleIcon} />
                  <Text style={[getVariantStyle('h2'), styles.successModalTitle]}>¡Compra Exitosa!</Text>
                </View>
                <TouchableOpacity
                  style={styles.successModalCloseButton}
                  onPress={() => setShowSuccessModal(false)}
                >
                  <Ionicons name="close-circle" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[getVariantStyle('subtitle'), styles.successModalSubtitle]}>Los puntos se han agregado a tu cuenta correctamente</Text>
            </LinearGradient>

            <View style={styles.successModalContent}>
              {/* Animación de puntos */}
              <View style={styles.successPointsAnimation}>
                <LinearGradient
                  colors={['#F59E0B', '#FBBF24', '#FCD34D']}
                  style={styles.successPointsCircle}
                >
                  <Ionicons name="star" size={48} color="#fff" />
                </LinearGradient>
                <Text style={[getVariantStyle('h2'), styles.successPointsText]}>+{purchasedPoints}</Text>
                <Text style={[getVariantStyle('caption'), styles.successPointsLabel]}>puntos agregados</Text>
              </View>

              {/* Información de la transacción */}
              <View style={styles.successTransactionInfo}>
                <View style={styles.successTransactionItem}>
                  <Ionicons name="time" size={20} color="#10B981" />
                  <Text style={[getVariantStyle('body'), styles.successTransactionText]}>
                    Transacción completada el {new Date().toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.successTransactionItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                  <Text style={[getVariantStyle('body'), styles.successTransactionText]}>
                    Pago procesado de forma segura
                  </Text>
                </View>
                <View style={styles.successTransactionItem}>
                  <Ionicons name="wallet" size={20} color="#10B981" />
                  <Text style={[getVariantStyle('body'), styles.successTransactionText]}>
                    Puntos disponibles inmediatamente
                  </Text>
                </View>
              </View>

              {/* Sección de próximos pasos */}
              <View style={styles.successNextSteps}>
                <LinearGradient
                  colors={['#f0f9ff', '#e0f2fe']}
                  style={styles.successNextStepsGradient}
                >
                  <Ionicons name="bulb" size={24} color="#667eea" style={styles.successNextStepsIcon} />
                  <Text style={[getVariantStyle('h2'), styles.successNextStepsTitle]}>¿Qué puedes hacer ahora?</Text>
                  <View style={styles.successNextStepsList}>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="game-controller" size={16} color="#10B981" />
                      <Text style={[getVariantStyle('body'), styles.successNextStepText]}>Jugar más trivia y ganar puntos</Text>
                    </View>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="gift" size={16} color="#F59E0B" />
                      <Text style={[getVariantStyle('body'), styles.successNextStepText]}>Canjear premios increíbles</Text>
                    </View>
                    <View style={styles.successNextStepItem}>
                      <Ionicons name="trophy" size={16} color="#667eea" />
                      <Text style={[getVariantStyle('body'), styles.successNextStepText]}>Participar en sorteos especiales</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.successModalFooter}>
              <TouchableOpacity
                style={styles.successContinueButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <LinearGradient
                  colors={['#10B981', '#34D399']}
                  style={styles.successContinueButtonGradient}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" style={styles.successContinueButtonIcon} />
                  <Text style={[getVariantStyle('body'), styles.successContinueButtonText]}>¡Perfecto!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Efectos de partículas */}
      <PointsParticles 
        trigger={showPointsParticles}
        onComplete={() => setShowPointsParticles(false)}
      />

      {/* Modal de Compra de Puntos - Diseño Mejorado */}
      <Modal
        visible={showBuyPointsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBuyPointsModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (showPaymentForm) {
              setShowPaymentForm(false);
              setCardNumber('');
              setCardHolder('');
              setExpiryDate('');
              setCvv('');
            }
            setShowBuyPointsModal(false);
            setSelectedPackage(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                style={styles.modalContainer}
              >
                <LinearGradient
                  colors={gradients.brand as unknown as [string, string]}
                  style={styles.modalHeader}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.modalHandle} />
                  <View style={styles.modalHeaderContent}>
                    <View style={styles.modalTitleContainer}>
                      <Ionicons name="wallet" size={28} color="#fff" style={styles.modalTitleIcon} />
                      <Text style={[styles.modalTitle, getVariantStyle('h2')]}>Comprar Puntos</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setShowBuyPointsModal(false)}
                      accessibilityRole="button"
                      accessibilityLabel="Cerrar compra de puntos"
                    >
                      <Ionicons name="close-circle" size={32} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={[getVariantStyle('subtitle'), styles.modalSubtitle]}>Selecciona el paquete perfecto para ti</Text>
                </LinearGradient>

                <ScrollView
                  style={styles.modalContent}
                  contentContainerStyle={styles.modalContentContainer}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {!showPaymentForm ? (
                    <>
                      <View style={styles.modalContentHeader}>
                        <Ionicons name="star" size={20} color="#667eea" style={styles.modalContentIcon} />
                        <Text style={[getVariantStyle('body'), styles.modalSubtitle]}>
                          Selecciona el paquete de puntos que deseas comprar
                        </Text>
                      </View>

                      {purchasePackages.map((pkg: PointPackage) => (
                        <TouchableOpacity
                          key={pkg.id}
                          style={[
                            styles.packageCard,
                            selectedPackage === pkg.id && styles.packageCardSelected
                          ]}
                          onPress={() => setSelectedPackage(pkg.id)}
                          accessibilityRole="button"
                          accessibilityLabel={`Seleccionar paquete ${pkg.name}`}
                        >
                          <LinearGradient
                            colors={
                              selectedPackage === pkg.id 
                                ? ['#6D28D9', '#8B5CF6'] 
                                : ['#fff', '#f8f9fa']
                            }
                            style={styles.packageGradient}
                          >
                            <View style={styles.packageHeader}>
                              <View style={styles.packageInfo}>
                                <Text style={[
                                  styles.packageName,
                                  selectedPackage === pkg.id && styles.packageNameSelected,
                                  getVariantStyle('subtitle')
                                ]}>
                                  {pkg.name}
                                </Text>
                                <Text style={[
                                  styles.packagePoints,
                                  selectedPackage === pkg.id && styles.packagePointsSelected,
                                  getVariantStyle('body')
                                ]}>
                                  {pkg.points} puntos
                                </Text>
                              </View>
                              <View style={styles.packagePrice}>
                                <Text style={[
                                  styles.packagePriceText,
                                  selectedPackage === pkg.id && styles.packagePriceTextSelected,
                                  getVariantStyle('subtitle')
                                ]}>
                                  ${pkg.price}
                                </Text>
                                
                              </View>
                            </View>
                            
                            {pkg.isPopular && (
                              <View style={styles.popularBadge}>
                                <Text style={[styles.popularText, getVariantStyle('caption')]}>Más Popular</Text>
                              </View>
                            )}
                          </LinearGradient>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <>
                      <View style={styles.modalContentHeader}>
                        <Ionicons name="card" size={20} color="#667eea" style={styles.modalContentIcon} />
                        <Text style={styles.modalSubtitle}>
                          Ingresa los datos de tu tarjeta
                        </Text>
                      </View>

                      {/* Información del paquete seleccionado */}
                      {selectedPackage && (
                        <View style={styles.selectedPackageInfo}>
                          <LinearGradient
                            colors={['#f0f9ff', '#e0f2fe']}
                            style={styles.selectedPackageGradient}
                          >
                            <View style={styles.selectedPackageHeader}>
                              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                              <Text style={styles.selectedPackageTitle}>
                                {selectedPkg?.name}
                              </Text>
                            </View>
                            
                            <Text style={styles.selectedPackagePrice}>
                              ${selectedPkg?.price}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}

                      {/* Formulario de tarjeta */}
                      <View style={styles.cardForm}>
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Número de Tarjeta</Text>
                          <TextInput
                            style={[
                              styles.cardInput,
                              touched.number && cardErrors.number ? styles.inputError : null,
                            ]}
                            value={cardNumber}
                            onChangeText={(text) => {
                              setCardNumber(formatCardNumber(text));
                              if (touched.number) validateCard();
                            }}
                            onFocus={() => setTouched((t) => ({ ...t, number: true }))}
                            placeholder="1234 5678 9012 3456"
                            keyboardType="numeric"
                            maxLength={19}
                          />
                          {touched.number && cardErrors.number ? (
                            <Text style={styles.inputErrorText}>{cardErrors.number}</Text>
                          ) : null}
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Titular de la Tarjeta</Text>
                          <TextInput
                            style={[
                              styles.cardInput,
                              touched.holder && cardErrors.holder ? styles.inputError : null,
                            ]}
                            value={cardHolder}
                            onChangeText={(text) => {
                              setCardHolder(text);
                              if (touched.holder) validateCard();
                            }}
                            onFocus={() => setTouched((t) => ({ ...t, holder: true }))}
                            placeholder="NOMBRE APELLIDO"
                            autoCapitalize="characters"
                          />
                          {touched.holder && cardErrors.holder ? (
                            <Text style={styles.inputErrorText}>{cardErrors.holder}</Text>
                          ) : null}
                        </View>

                        <View style={styles.cardRow}>
                          <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.inputLabel}>Fecha de Vencimiento</Text>
                            <TextInput
                              style={[
                                styles.cardInput,
                                touched.expiry && cardErrors.expiry ? styles.inputError : null,
                              ]}
                              value={expiryDate}
                              onChangeText={(text) => {
                                setExpiryDate(formatExpiryDate(text));
                                if (touched.expiry) validateCard();
                              }}
                              onFocus={() => setTouched((t) => ({ ...t, expiry: true }))}
                              placeholder="MM/AA"
                              keyboardType="numeric"
                              maxLength={5}
                            />
                            {touched.expiry && cardErrors.expiry ? (
                              <Text style={styles.inputErrorText}>{cardErrors.expiry}</Text>
                            ) : null}
                          </View>

                          <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.inputLabel}>CVV</Text>
                            <TextInput
                              style={[
                                styles.cardInput,
                                touched.cvv && cardErrors.cvv ? styles.inputError : null,
                              ]}
                              value={cvv}
                              onChangeText={(text) => {
                                setCvv(text);
                                if (touched.cvv) validateCard();
                              }}
                              onFocus={() => setTouched((t) => ({ ...t, cvv: true }))}
                              placeholder="123"
                              keyboardType="numeric"
                              maxLength={3}
                              secureTextEntry
                            />
                            {touched.cvv && cardErrors.cvv ? (
                              <Text style={styles.inputErrorText}>{cardErrors.cvv}</Text>
                            ) : null}
                          </View>
                        </View>

                        <View style={styles.securityInfo}>
                          <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                          <Text style={styles.securityText}>
                            Tus datos están protegidos con encriptación SSL
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      if (showPaymentForm) {
                        setShowPaymentForm(false);
                        setCardNumber('');
                        setCardHolder('');
                        setExpiryDate('');
                        setCvv('');
                      } else {
                        setShowBuyPointsModal(false);
                        setSelectedPackage(null);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={showPaymentForm ? 'Volver atrás' : 'Cancelar compra'}
                  >
                    <Text style={styles.cancelButtonText}>
                      {showPaymentForm ? 'Atrás' : 'Cancelar'}
                    </Text>
                  </TouchableOpacity>
                  
                  {!showPaymentForm ? (
                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        !selectedPackage && styles.purchaseButtonDisabled
                      ]}
                      onPress={handlePurchasePoints}
                      disabled={!selectedPackage}
                      accessibilityRole="button"
                      accessibilityLabel="Continuar a método de pago"
                    >
                      <LinearGradient
                        colors={selectedPackage ? ['#6D28D9', '#8B5CF6'] : ['#ccc', '#999']}
                        style={styles.purchaseButtonGradient}
                      >
                        <Text style={styles.purchaseButtonText}>Continuar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.purchaseButton,
                        (!cardNumber || !cardHolder || !expiryDate || !cvv) && styles.purchaseButtonDisabled
                      ]}
                      onPress={handlePaymentSubmit}
                      disabled={!cardNumber || !cardHolder || !expiryDate || !cvv || isPurchasing}
                      accessibilityRole="button"
                      accessibilityLabel={isPurchasing ? 'Procesando pago' : 'Confirmar pago'}
                    >
                      <LinearGradient
                        colors={
                          (cardNumber && cardHolder && expiryDate && cvv) 
                            ? ['#6D28D9', '#8B5CF6'] 
                            : ['#ccc', '#999']
                        }
                        style={styles.purchaseButtonGradient}
                      >
                        <Text style={styles.purchaseButtonText}>
                          {isPurchasing ? 'Procesando...' : 'Pagar'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'red',
    width: '100%',
  },
  header: {
    marginTop: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    marginStart: 20,
    marginEnd: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: "absolute",
    top: 20,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle2: {
    position: "absolute",
    bottom: 20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle3: {
    position: "absolute",
    top: 60,
    left: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    zIndex: 1,
  },
  headerTopSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsSection: {
    marginTop: 0,
  },
  userInfo: {
    flex: 1,
  },
  greetingContainer: {
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 6,
    marginBottom: 0,
    alignSelf: "flex-start",
  },
  greeting: {
    marginTop: 5,
    color: "#1f2937",
    textAlign: "left",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: "#374151",
    opacity: 0.9,
    textShadowColor: "rgba(255, 255, 255, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    marginRight: 5,
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4757",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileGradient: {
    padding: 8,
    borderRadius: 20,
  },
  pointsCardContainer: {
    marginTop: -20,
    zIndex: 2,
  },
  pointsCard: {
    margin: 16,
    padding: 0,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  pointsGradient: {
    padding: 16,
  },
  // Nuevos estilos para el diseño moderno
  pointsMainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsMainInfo: {
    flex: 1,
  },
  pointsMainTitle: {
    color: '#374151',
    marginBottom: 3,
    fontWeight: '500',
  },
  pointsMainAmount: {
    color: '#1f2937',
    marginBottom: 2,
  },
  pointsMainLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  pointsAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  pointsIcon: {
    marginLeft: 8,
  },
  pointsIconBadge: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pointsIconBadgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsMainIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  pointsMainIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsProgressContainer: {
    marginBottom: 12,
  },
  pointsProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsProgressText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pointsProgressPercent: {
    fontSize: 14,
    color: '#cfae0e',
    fontWeight: 'bold',
  },
  pointsProgressBar: {
    height: 6,
    backgroundColor: 'rgba(31, 41, 55, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  pointsProgressFill: {
    height: '100%',
    backgroundColor: '#cfae0e',
    borderRadius: 3,
  },
  pointsStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pointsStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pointsStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsStatContent: {
    alignItems: 'center',
  },
  pointsStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  pointsStatLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  pointsActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointsActionBtn: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pointsActionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pointsActionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  pointsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  pointsIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 8,
  },
  pointsAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pointsLabel: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    opacity: 0.9,
  },
  // Nuevos estilos para el patrón de fondo
  pointsBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  pointsCircle1: {
    position: "absolute",
    top: 20,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  pointsCircle2: {
    position: "absolute",
    bottom: -20,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  pointsCircle3: {
    position: "absolute",
    top: 80,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  pointsWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  // Nuevos estilos para header
  pointsTitleContainer: {
    flex: 1,
  },
  pointsSubtitle: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.8,
    marginTop: 1,
  },
  pointsIconGradient: {
    padding: 4,
    borderRadius: 8,
  },
  // Nuevos estilos para el contador principal
  pointsMainContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  pointsLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  // Estilos para la barra de nivel
  levelContainer: {
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  levelBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  levelProgress: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 2,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  levelLabel: {
    fontSize: 10,
    color: "#fff",
    textAlign: "center",
    opacity: 0.8,
  },
  // Nuevos estilos para breakdown
  pointsBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  pointsItem: {
    alignItems: "center",
    flex: 1,
  },
  pointsItemGradient: {
    padding: 3,
    borderRadius: 6,
    marginBottom: 3,
  },
  pointsItemText: {
    alignItems: "center",
  },
  pointsItemLabel: {
    fontSize: 9,
    color: "#fff",
    marginBottom: 1,
    opacity: 0.9,
    textAlign: "center",
  },
  pointsItemValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  // Estilos para botones de acción
  pointsActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  pointsActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  pointsActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pointsActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Inter_500Medium',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllText: {
    color: "#efb810",
    fontSize: 16,
    fontWeight: "600",
  },
  surveysRow: {
    paddingLeft: 4,
    paddingRight: 20,
  },
  surveyCardSmall: {
    width: 200,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  surveyCardGradient: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    justifyContent: 'center',
  },
  surveyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  surveyCardPoints: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  surveyCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  surveyCardSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 8,
    padding: 0,
    overflow: "hidden",
    borderRadius: 16,
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 16,
    position: "relative",
  },
  actionIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  actionArrow: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  categoriesContainer: {
    paddingRight: 20,
    paddingLeft: 4,
  },
  categoryCard: {
    width: 140,
    marginRight: 20,
    padding: 0,
    overflow: "hidden",
    borderRadius: 16,
  },
  categoryGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 16,
    position: "relative",
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoryQuestions: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  categoryPlayButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Estilos del Modal - Diseño Mejorado
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  modalHeader: {
    padding: 24,
    position: 'relative',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 12,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitleIcon: {
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  modalContent: {
    padding: 24,
  },
  modalContentContainer: {
    paddingBottom: CONTROL_HEIGHT + 24,
  },
  modalContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  modalContentIcon: {
    marginRight: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'left',
    flex: 1,
    lineHeight: 22,
  },
  packageCard: {
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: CONTROL_HEIGHT,
  },
  packageCardSelected: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
    borderColor: '#A78BFA',
    transform: [{ scale: 1.02 }],
  },
  packageGradient: {
    padding: 16,
    borderRadius: 10,
    position: 'relative',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: CONTROL_HEIGHT,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  packageNameSelected: {
    color: '#fff',
  },
  packagePoints: {
    fontSize: 16,
    color: '#6c757d',
  },
  packagePointsSelected: {
    color: '#fff',
    opacity: 0.9,
  },
  packagePrice: {
    alignItems: 'flex-end',
  },
  packagePriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  packagePriceTextSelected: {
    color: '#fff',
  },
  
  popularBadge: {
    position: 'absolute',
    top: 7,
    right: 12,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  cancelButton: {
    flex: 2.5,
    marginRight: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: CONTROL_HEIGHT,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  purchaseButton: {
    flex: 2.5,
    marginLeft: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    height: CONTROL_HEIGHT,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonGradient: {
    paddingHorizontal: 20,
    alignItems: 'center',
    height: CONTROL_HEIGHT,
    justifyContent: 'center',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Estilos del formulario de tarjeta - Mejorados
  selectedPackageInfo: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedPackageGradient: {
    padding: 20,
    borderRadius: 16,
  },
  selectedPackageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedPackageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginLeft: 12,
    flex: 1,
  },
  selectedPackagePrice: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: '700',
    textAlign: 'right',
  },
  selectedPackageDescription: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
    marginBottom: 10,
  },
  cardForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  cardInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#0369a1',
    marginLeft: 8,
    flex: 1,
  },
  // Estilos del Modal de Trivia
  triviaModalContainer: {
    width: '94%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  triviaModalHeader: {
    padding: 24,
    position: 'relative',
  },
  triviaModalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  triviaModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  triviaModalTitleIcon: {
    marginRight: 12,
  },
  triviaModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  triviaModalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  triviaModalSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  triviaModalContent: {
    padding: 24,
  },
  triviaTipsSection: {
    marginBottom: 0,
  },
  triviaTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  triviaTipsIcon: {
    marginRight: 12,
  },
  triviaTipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  triviaTipsList: {
    gap: 16,
  },
  triviaTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#C4B5FD',
  },
  triviaTipText: {
    fontSize: 16,
    color: '#2d3748',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  triviaStatsSection: {
    marginBottom: 32,
  },
  triviaStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  triviaStatsIcon: {
    marginRight: 12,
  },
  triviaStatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  triviaStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  triviaStatCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  triviaStatGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  triviaStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  triviaStatLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  triviaMotivationSection: {
    marginBottom: 24,
  },
  triviaMotivationGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  triviaMotivationIcon: {
    marginBottom: 12,
  },
  triviaMotivationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  triviaMotivationText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
  },
  triviaModalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
    gap: 16,
  },
  triviaCancelButton: {
    flex: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  triviaCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  triviaStartButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  triviaStartButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  triviaStartButtonIcon: {
    marginRight: 8,
  },
  triviaStartButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Estilos del Modal de Compra Exitosa
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
  successModalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 4,
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
  successPointsAnimation: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successPointsCircle: {
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
  successPointsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  successPointsLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  successTransactionInfo: {
    marginBottom: 32,
    gap: 16,
  },
  successTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successTransactionText: {
    fontSize: 16,
    color: '#2d3748',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
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
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  successContinueButton: {
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
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2, // 2 columnas con padding y gap
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  quickActionGradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderRadius: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 0,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  quickActionIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  quickActionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderColor: '#fff',
    borderWidth: 1,
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  demoBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#111827',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderColor: '#fff',
    borderWidth: 1,
  },
  demoBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  featuredContainer: {
    paddingRight: 20,
  },
  featuredCard: {
    width: 200,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featuredSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2, // 2 columnas con padding y gap
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
