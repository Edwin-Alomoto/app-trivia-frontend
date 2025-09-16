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
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Card } from '@shared/presentation/components/ui/Card';
import { Button } from '@shared/presentation/components/ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { simulateWinner } from '../../store/slices/rafflesSlice';
import { createWinnerNotification } from '../../store/slices/notificationsSlice';

const { width, height } = Dimensions.get('window');

interface RouletteWinner {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
  isNew: boolean;
}

interface ActiveRaffle {
  id: string;
  name: string;
  prize: string;
  prizeValue: number;
  endDate: string;
  currentParticipants: number;
  maxParticipants: number;
  category: string;
}

export const RouletteScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [winners, setWinners] = useState<RouletteWinner[]>([]);
  const [activeRaffle, setActiveRaffle] = useState<ActiveRaffle | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<RouletteWinner | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'whatsapp' | null>(null);
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(true);
  
  // Estados para formulario de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rouletteAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Datos mock de sorteo activo
  const mockActiveRaffle: ActiveRaffle = {
    id: 'active-1',
    name: 'Sorteo Mega de $1000 USD',
    prize: '$1000 USD en efectivo',
    prizeValue: 1000,
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
    currentParticipants: 1000, // Sorteo completo
    maxParticipants: 1000,
    category: 'money',
  };

  // Datos mock de ganadores
  const mockWinners: RouletteWinner[] = [
    {
      id: '1',
      name: 'María G.',
      amount: 250,
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      isNew: true,
    },
    {
      id: '2',
      name: 'Carlos R.',
      amount: 500,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isNew: true,
    },
    {
      id: '3',
      name: 'Ana L.',
      amount: 100,
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '4',
      name: 'Luis M.',
      amount: 750,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '5',
      name: 'Sofia K.',
      amount: 300,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '6',
      name: 'Diego P.',
      amount: 150,
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '7',
      name: 'Valeria N.',
      amount: 400,
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '8',
      name: 'Roberto S.',
      amount: 600,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '9',
      name: 'Carmen V.',
      amount: 200,
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      isNew: false,
    },
    {
      id: '10',
      name: 'Fernando T.',
      amount: 350,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isNew: false,
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

    // Animación continua de la ruleta
    startRouletteAnimation();
  }, []);

  // Efecto para manejar el estado de la ruleta
  useEffect(() => {
    if (!isRouletteSpinning) {
      // Detener la animación cuando el sorteo está completo
      spinAnim.stopAnimation();
    }
  }, [isRouletteSpinning]);

  const startRouletteAnimation = () => {
    if (isRouletteSpinning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  };

  const loadData = async () => {
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWinners(mockWinners);
      setActiveRaffle(mockActiveRaffle);
      
      // Verificar si el sorteo está completo
      if (mockActiveRaffle.currentParticipants >= mockActiveRaffle.maxParticipants) {
        // El sorteo está completo, detener la ruleta después de 3 segundos
        setTimeout(() => {
          setIsRouletteSpinning(false);
        }, 3000);
      }
    } catch (error) {
      // Silenciar log en producción
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleWinnerPress = (winner: RouletteWinner) => {
    setSelectedWinner(winner);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method: 'card' | 'whatsapp') => {
    setPaymentMethod(method);
    Haptics.selectionAsync();
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '¡Pago Procesado!',
        `Se han transferido $${selectedWinner?.amount} USD a tu tarjeta. El pago se reflejará en 1-3 días hábiles.`,
        [{ text: 'Entendido' }]
      );
      
      setShowPaymentModal(false);
      setPaymentMethod(null);
      resetForm();
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hola, soy ${user?.name} y gané $${selectedWinner?.amount} USD en el sorteo. Mi ID de participación es ${selectedWinner?.id}. ¿Cómo procedo para recibir mi premio?`;
    const whatsappUrl = `whatsapp://send?phone=+1234567890&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo');
      }
    });
    
    setShowPaymentModal(false);
    setPaymentMethod(null);
  };

  const resetForm = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizado';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Menos de 1m';
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Efecto visual cuando la ruleta se detiene
  const rouletteOpacity = isRouletteSpinning ? 1 : 0.7;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
            <View style={styles.titleContainer}>
              <Ionicons name="trophy" size={32} color="#f59e0b" />
              <Text style={styles.title}>Ruleta de Ganadores</Text>
            </View>
            <Text style={styles.subtitle}>
              {activeRaffle ? `Sorteo activo: ${activeRaffle.prize}` : 'Sorteos en tiempo real • Últimos 10 ganadores'}
            </Text>
          </View>
        </Animated.View>

        {/* Sorteo Activo */}
        {activeRaffle && (
          <Animated.View
            style={[
              styles.activeRaffleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.activeRaffleCard}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.activeRaffleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.activeRaffleHeader}>
                  <View style={styles.activeRaffleInfo}>
                    <Text style={styles.activeRaffleTitle}>{activeRaffle.name}</Text>
                    <Text style={styles.activeRafflePrize}>{activeRaffle.prize}</Text>
                                         <Text style={styles.activeRaffleTime}>
                       {activeRaffle.currentParticipants >= activeRaffle.maxParticipants 
                         ? 'Sorteo finalizado' 
                         : `Termina en: ${formatTimeRemaining(activeRaffle.endDate)}`
                       }
                     </Text>
                  </View>
                  <View style={styles.activeRaffleStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{activeRaffle.currentParticipants}</Text>
                      <Text style={styles.statLabel}>Participantes</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{activeRaffle.maxParticipants}</Text>
                      <Text style={styles.statLabel}>Máximo</Text>
                    </View>
                  </View>
                </View>
                                 <View style={styles.progressContainer}>
                   <View style={styles.progressBar}>
                     <View 
                       style={[
                         styles.progressFill, 
                         { width: `${(activeRaffle.currentParticipants / activeRaffle.maxParticipants) * 100}%` }
                       ]} 
                     />
                   </View>
                   <Text style={styles.progressText}>
                     {activeRaffle.currentParticipants >= activeRaffle.maxParticipants 
                       ? '¡SORTEO COMPLETADO!' 
                       : `${Math.round((activeRaffle.currentParticipants / activeRaffle.maxParticipants) * 100)}% completo`
                     }
                   </Text>
                 </View>
              </LinearGradient>
            </Card>
          </Animated.View>
        )}

                 {/* Ruleta Animada */}
         <Animated.View
           style={[
             styles.rouletteContainer,
             {
               opacity: rouletteOpacity,
               transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
             },
           ]}
         >
          <View style={styles.rouletteWrapper}>
            <Animated.View
              style={[
                styles.roulette,
                {
                  transform: [{ rotate: spinInterpolate }],
                },
              ]}
            >
              <LinearGradient
                colors={['#f59e0b', '#f97316', '#ea580c']}
                style={styles.rouletteGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="trophy" size={40} color="#fff" />
              </LinearGradient>
            </Animated.View>
                         <Text style={[
               styles.rouletteText,
               !isRouletteSpinning && styles.rouletteTextCompleted
             ]}>
               {isRouletteSpinning ? '¡GIRANDO!' : 'SORTEO COMPLETADO'}
             </Text>
          </View>
        </Animated.View>

        {/* Botón para simular ganador */}
        <Animated.View
          style={[
            styles.simulateWinnerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.simulateWinnerButton}
            onPress={() => {
              Alert.alert(
                '🎯 Simular Ganador',
                '¿Quieres simular que ganas este sorteo para probar las notificaciones?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: '¡Simular!', 
                    onPress: async () => {
                      try {
                        // Método 1: Usar simulateWinner
                        const result = await dispatch(simulateWinner('active-1')).unwrap();
                        Alert.alert(
                          '🎉 ¡Felicidades!', 
                          result.message + '\n\nVe a Notificaciones para ver tu premio.',
                          [
                            { text: 'Ver Notificaciones', onPress: () => navigation.navigate('Notifications' as never) },
                            { text: 'OK' }
                          ]
                        );
                      } catch (error: any) {
                        // Método 2: Crear notificación directamente si falla
                        dispatch(createWinnerNotification({
                          raffleName: 'Sorteo Mega de $1000 USD',
                          prizeAmount: 1000,
                          prizeType: 'USD',
                          raffleId: 'active-1',
                        }));
                        Alert.alert(
                          '🎉 ¡Felicidades!', 
                          '¡Has ganado 1000 USD en el Sorteo Mega! Ve a Notificaciones para ver tu premio.',
                          [
                            { text: 'Ver Notificaciones', onPress: () => navigation.navigate('Notifications' as never) },
                            { text: 'OK' }
                          ]
                        );
                      }
                    }
                  }
                ]
              );
            }}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.simulateWinnerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="star" size={20} color="#fff" />
              <Text style={styles.simulateWinnerButtonText}>🎯 Simular que Gano</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Lista de Ganadores */}
        <Animated.View
          style={[
            styles.winnersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            {activeRaffle ? `Ganadores de "${activeRaffle.name}"` : 'Últimos Ganadores'}
          </Text>
          
          {winners.map((winner, index) => (
            <TouchableOpacity
              key={winner.id}
              style={[
                styles.winnerCard,
                winner.isNew && styles.newWinnerCard,
              ]}
              onPress={() => handleWinnerPress(winner)}
              activeOpacity={0.8}
            >
              <View style={styles.winnerHeader}>
                <View style={styles.winnerInfo}>
                  <Text style={styles.winnerName}>{winner.name}</Text>
                  <Text style={styles.winnerTime}>
                    {formatTimeAgo(winner.timestamp)}
                  </Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountSymbol}>$</Text>
                  <Text style={styles.amountValue}>{winner.amount}</Text>
                  <Text style={styles.amountCurrency}>USD</Text>
                </View>
              </View>
              
              {winner.isNew && (
                <View style={styles.newBadge}>
                  <Ionicons name="flash" size={12} color="#fff" />
                  <Text style={styles.newBadgeText}>NUEVO</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Información */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={styles.infoTitle}>¿Cómo recibir mi premio?</Text>
            </View>
            <Text style={styles.infoText}>
              Al ganar un sorteo, puedes elegir entre recibir el pago directamente 
              a tu tarjeta bancaria o contactar al encargado por WhatsApp para 
              coordinar la entrega de tu recompensa.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Modal de Pago */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recibir Premio</Text>
              <Text style={styles.modalSubtitle}>
                Ganaste ${selectedWinner?.amount} USD
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.paymentMethodTitle}>
                Selecciona cómo recibir tu premio:
              </Text>

              {/* Opción Tarjeta Bancaria */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'card' && styles.paymentOptionSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('card')}
              >
                <View style={styles.paymentOptionHeader}>
                  <Ionicons 
                    name="card" 
                    size={24} 
                    color={paymentMethod === 'card' ? '#10b981' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.paymentOptionTitle,
                    paymentMethod === 'card' && styles.paymentOptionTitleSelected,
                  ]}>
                    Tarjeta Bancaria
                  </Text>
                </View>
                <Text style={styles.paymentOptionDescription}>
                  Recibe el pago directamente en tu cuenta bancaria
                </Text>
              </TouchableOpacity>

              {/* Opción WhatsApp */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'whatsapp' && styles.paymentOptionSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('whatsapp')}
              >
                <View style={styles.paymentOptionHeader}>
                  <Ionicons 
                    name="logo-whatsapp" 
                    size={24} 
                    color={paymentMethod === 'whatsapp' ? '#25d366' : '#6b7280'} 
                  />
                  <Text style={[
                    styles.paymentOptionTitle,
                    paymentMethod === 'whatsapp' && styles.paymentOptionTitleSelected,
                  ]}>
                    Contactar por WhatsApp
                  </Text>
                </View>
                <Text style={styles.paymentOptionDescription}>
                  Coordina la entrega con nuestro equipo
                </Text>
              </TouchableOpacity>

              {/* Formulario de Tarjeta */}
              {paymentMethod === 'card' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>Datos de la Tarjeta</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Número de tarjeta"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    maxLength={16}
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Titular de la tarjeta"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    autoCapitalize="words"
                  />
                  
                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChangeText={setExpiryDate}
                      maxLength={5}
                    />
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="CVV"
                      value={cvv}
                      onChangeText={setCvv}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                </View>
              )}

              {/* Botones de Acción */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPaymentModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                {paymentMethod === 'card' ? (
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      (!cardNumber || !cardHolder || !expiryDate || !cvv) && styles.confirmButtonDisabled,
                    ]}
                    onPress={handleCardPayment}
                    disabled={!cardNumber || !cardHolder || !expiryDate || !cvv || isProcessing}
                  >
                    <Ionicons name="card" size={18} color="#fff" />
                    <Text style={styles.confirmButtonText}>
                      {isProcessing ? 'Procesando...' : 'Recibir Pago'}
                    </Text>
                  </TouchableOpacity>
                ) : paymentMethod === 'whatsapp' ? (
                  <TouchableOpacity
                    style={[styles.confirmButton, styles.whatsappButton]}
                    onPress={handleWhatsAppContact}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                    <Text style={styles.confirmButtonText}>Contactar WhatsApp</Text>
                  </TouchableOpacity>
                ) : null}
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
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  rouletteContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  rouletteWrapper: {
    alignItems: 'center',
  },
  roulette: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rouletteGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rouletteText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'center',
  },
  rouletteTextCompleted: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  simulateWinnerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  simulateWinnerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  simulateWinnerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  simulateWinnerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  activeRaffleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activeRaffleCard: {
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeRaffleGradient: {
    padding: 20,
  },
  activeRaffleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activeRaffleInfo: {
    flex: 1,
  },
  activeRaffleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  activeRafflePrize: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  activeRaffleTime: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  activeRaffleStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  winnersContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  winnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  newWinnerCard: {
    borderColor: '#f59e0b',
    borderWidth: 2,
    backgroundColor: '#fef3c7',
  },
  winnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  winnerTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginHorizontal: 2,
  },
  amountCurrency: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    padding: 20,
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
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  paymentOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 12,
  },
  paymentOptionTitleSelected: {
    color: '#1f2937',
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 36,
  },
  cardForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#10b981',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  whatsappButton: {
    backgroundColor: '#25d366',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
});
