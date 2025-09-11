import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../theme/gradients';
import { getVariantStyle } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchPackages, purchasePoints } from '../../store/slices/purchasesSlice';
import { PointPackage } from '../../types';
import { featureFlags } from '../../config/featureFlags';
import { usePurchasesViewModel } from '../../viewmodels/purchases/usePurchasesViewModel';

const { width, height } = Dimensions.get('window');

export const BuyPointsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { packages, isLoading, error } = useAppSelector((state) => state.purchases);
  const vm = featureFlags.useMVVMPurchases ? usePurchasesViewModel() : null;
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    if (vm) {
      vm.refresh();
    } else {
      loadPackages();
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

  const loadPackages = async () => {
    try {
      await dispatch(fetchPackages()).unwrap();
    } catch (error) {
      console.error('Error cargando paquetes:', error);
    }
  };

  const handlePackageSelect = (pkg: PointPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
    if (vm) vm.selectPackage(pkg.id);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      if (vm) {
        const res = await vm.confirmPurchase();
        if (!res.ok) throw new Error(res.error);
      } else {
        await dispatch(purchasePoints(selectedPackage.id)).unwrap();
      }
      
      Alert.alert(
        '¡Compra exitosa!',
        `Se han acreditado ${selectedPackage.points.toLocaleString()} puntos a tu cuenta.`,
        [
          {
            text: 'Ver mi balance',
            onPress: () => navigation.navigate('PointsHistory' as never),
          },
          {
            text: 'Continuar',
            style: 'default',
          },
        ]
      );
      
      setShowPaymentModal(false);
      setSelectedPackage(null);
    } catch (error) {
      Alert.alert(
        'Error en la compra',
        error instanceof Error ? error.message : 'Hubo un problema procesando tu pago. Inténtalo de nuevo.',
        [
          { text: 'Reintentar', onPress: () => handlePurchase() },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'apple':
        return 'logo-apple';
      default:
        return 'card-outline';
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card':
        return 'Tarjeta de crédito/débito';
      case 'paypal':
        return 'PayPal';
      case 'apple':
        return 'Apple Pay';
      default:
        return 'Método de pago';
    }
  };

  const renderPackageCard = (pkg: PointPackage, index: number) => (
    <Animated.View
      key={pkg.id}
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <Card
        style={[
          styles.packageCard,
          pkg.isPopular ? styles.popularPackageCard : {},
        ] as any}
        onPress={() => handlePackageSelect(pkg)}
      >
        <LinearGradient
          colors={gradients.brand as unknown as [string, string]}
          style={styles.packageGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {pkg.isPopular && (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={16} color="#fff" />
              <Text style={styles.popularBadgeText}>Más Popular</Text>
            </View>
          )}

          {pkg.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{pkg.discount}%</Text>
            </View>
          )}

          <View style={styles.packageHeader}>
            <Text style={[
              getVariantStyle('h1'),
              styles.packageName,
              { color: pkg.isPopular ? '#fff' : '#2d3748' }
            ]}>
              {pkg.name}
            </Text>
            <Text style={[
              getVariantStyle('h2'),
              styles.packagePoints,
              { color: pkg.isPopular ? '#fff' : '#10b981' }
            ]}>
              {pkg.points.toLocaleString()} puntos
            </Text>
          </View>

          <View style={styles.packagePrice}>
            <Text style={[
              getVariantStyle('h1'),
              styles.priceAmount,
              { color: pkg.isPopular ? '#fff' : '#2d3748' }
            ]}>
              ${pkg.price}
            </Text>
            <Text style={[
              getVariantStyle('subtitle'),
              styles.priceCurrency,
              { color: pkg.isPopular ? '#fff' : '#6c757d' }
            ]}>
              {pkg.currency}
            </Text>
          </View>

          <View style={styles.packageValue}>
            <Text style={[
              getVariantStyle('subtitle'),
              styles.valueText,
              { color: pkg.isPopular ? '#fff' : '#6c757d' }
            ]}>
              ${(pkg.price / pkg.points * 1000).toFixed(2)} por 1,000 puntos
            </Text>
          </View>

          <View style={styles.packageAction}>
            <Text style={[
              getVariantStyle('h2'),
              styles.actionText,
              { color: pkg.isPopular ? '#fff' : '#667eea' }
            ]}>
              Seleccionar
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={pkg.isPopular ? '#fff' : '#667eea'} 
            />
          </View>
        </LinearGradient>
      </Card>
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
          colors={gradients.header as unknown as [string, string]}
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
            <Text style={[getVariantStyle('h1'), styles.title]}>Comprar Puntos</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Info Section */}
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
          <LinearGradient
            colors={gradients.brand as unknown as [string, string]}
            style={styles.infoGradient}
          >
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color="#0ea5e9" />
              <Text style={[getVariantStyle('h1'), styles.infoTitle]}>¿Por qué comprar puntos?</Text>
            </View>
            <Text style={[getVariantStyle('body'), styles.infoText]}>
              • Participa en sorteos exclusivos{'\n'}
              • Canjea premios premium{'\n'}
              • Acceso a contenido especial{'\n'}
              • Sin límites de tiempo
            </Text>
          </LinearGradient>
        </Card>
      </Animated.View>

      {/* Packages */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.packagesContainer}
      >
        <Text style={[getVariantStyle('h1'), styles.sectionTitle]}>Paquetes Disponibles</Text>
        
        {(vm ? vm.packages : packages).map((pkg: PointPackage, index: number) => renderPackageCard(pkg, index))}

        {(vm ? vm.packages : packages).length === 0 && !(vm ? vm.isLoading : isLoading) && (
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
              <Ionicons name="card-outline" size={64} color="#6c757d" />
            </View>
            <Text style={[getVariantStyle('h2'), styles.emptyStateTitle]}>No hay paquetes disponibles</Text>
            <Text style={[getVariantStyle('body'), styles.emptyStateSubtitle]}>
              Intenta más tarde o contacta soporte
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContainer}>
            <LinearGradient
              colors={gradients.brand as unknown as [string, string]}
              style={styles.paymentModalHeader}
            >
              <Text style={[getVariantStyle('h1'), styles.paymentModalTitle]}>Método de Pago</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.paymentModalContent}>
              <View style={styles.packageSummary}>
                <Text style={[getVariantStyle('h1'), styles.summaryTitle]}>Resumen de compra</Text>
                <View style={styles.summaryItem}>
                  <Text style={[getVariantStyle('body'), styles.summaryLabel]}>Paquete:</Text>
                  <Text style={[getVariantStyle('h2'), styles.summaryValue]}>{selectedPackage?.name}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[getVariantStyle('body'), styles.summaryLabel]}>Puntos:</Text>
                  <Text style={[getVariantStyle('h2'), styles.summaryValue]}>{selectedPackage?.points.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[getVariantStyle('body'), styles.summaryLabel]}>Total:</Text>
                  <Text style={[getVariantStyle('h1'), styles.summaryTotal]}>${selectedPackage?.price}</Text>
                </View>
              </View>

              <View style={styles.paymentMethods}>
                <Text style={[getVariantStyle('h2'), styles.paymentMethodsTitle]}>Selecciona tu método de pago</Text>
                
                {[
                  { key: 'card', label: 'Tarjeta de crédito/débito' },
                  { key: 'paypal', label: 'PayPal' },
                  { key: 'apple', label: 'Apple Pay' },
                ].map((method) => (
                  <TouchableOpacity
                    key={method.key}
                    style={[
                      styles.paymentMethod,
                      paymentMethod === method.key && styles.paymentMethodSelected
                    ]}
                    onPress={() => setPaymentMethod(method.key as any)}
                  >
                    <Ionicons
                      name={getPaymentMethodIcon(method.key) as any}
                      size={24}
                      color={paymentMethod === method.key ? '#667eea' : '#6c757d'}
                    />
                    <Text style={[
                      getVariantStyle('body'),
                      styles.paymentMethodText,
                      paymentMethod === method.key && getVariantStyle('h2'),
                      paymentMethod === method.key && styles.paymentMethodTextSelected
                    ]}>
                      {method.label}
                    </Text>
                    {paymentMethod === method.key && (
                      <Ionicons name="checkmark-circle" size={24} color="#667eea" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Confirmar Compra"
                onPress={handlePurchase}
                variant="primary"
                style={styles.confirmButton}
                disabled={isLoading}
              />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  placeholder: {
    width: 40,
  },
  infoContainer: {
    marginTop: -10,
    zIndex: 2,
  },
  infoCard: {
    margin: 20,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  packagesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  packageCard: {
    marginBottom: 20,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  popularPackageCard: {
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    elevation: 12,
  },
  packageGradient: {
    padding: 24,
    borderRadius: 16,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageHeader: {
    marginBottom: 16,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packagePoints: {
    fontSize: 18,
    fontWeight: '600',
  },
  packagePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: '500',
  },
  packageValue: {
    marginBottom: 20,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
  },
  packageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
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
    lineHeight: 22,
  },
  // Estilos del modal de pago
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  paymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  paymentModalContent: {
    padding: 20,
  },
  packageSummary: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  paymentMethods: {
    marginBottom: 24,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 12,
  },
  paymentMethodTextSelected: {
    color: '#667eea',
    fontWeight: '600',
  },
  confirmButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
});
