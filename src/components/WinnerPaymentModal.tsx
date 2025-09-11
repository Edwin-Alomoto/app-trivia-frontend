import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

interface WinnerPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  winnerData: {
    raffleName: string;
    prizeAmount: number;
    prizeType: string;
    raffleId: string;
  } | null;
  userName?: string;
}

export const WinnerPaymentModal: React.FC<WinnerPaymentModalProps> = ({
  visible,
  onClose,
  winnerData,
  userName = 'Usuario',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'whatsapp' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para formulario de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

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
        `Se han transferido ${winnerData?.prizeAmount} ${winnerData?.prizeType} a tu tarjeta. El pago se reflejará en 1-3 días hábiles.`,
        [{ text: 'Entendido', onPress: handleClose }]
      );
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hola, soy ${userName} y gané ${winnerData?.prizeAmount} ${winnerData?.prizeType} en el sorteo "${winnerData?.raffleName}". Mi ID de participación es ${winnerData?.raffleId}. ¿Cómo procedo para recibir mi premio?`;
    const whatsappUrl = `whatsapp://send?phone=+1234567890&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
        handleClose();
      } else {
        Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo');
      }
    });
  };

  const handleClose = () => {
    setPaymentMethod(null);
    setIsProcessing(false);
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    onClose();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  if (!winnerData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#f59e0b', '#f97316']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.headerContent}>
                  <Ionicons name="trophy" size={40} color="#fff" />
                  <Text style={styles.headerTitle}>¡FELICIDADES!</Text>
                  <Text style={styles.headerSubtitle}>Has ganado un sorteo</Text>
                </View>
              </LinearGradient>
            </View>

            {/* Información del Premio */}
            <View style={styles.prizeInfo}>
              <Text style={styles.prizeTitle}>{winnerData.raffleName}</Text>
              <View style={styles.prizeAmount}>
                <Text style={styles.prizeSymbol}>$</Text>
                <Text style={styles.prizeValue}>{winnerData.prizeAmount}</Text>
                <Text style={styles.prizeCurrency}>{winnerData.prizeType}</Text>
              </View>
              <Text style={styles.prizeDescription}>
                Selecciona cómo quieres recibir tu premio
              </Text>
            </View>

            {/* Opciones de Pago */}
            <View style={styles.paymentOptions}>
              <Text style={styles.sectionTitle}>Método de Pago</Text>
              
              {/* Opción Tarjeta */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'card' && styles.paymentOptionSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('card')}
              >
                <View style={styles.paymentOptionContent}>
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="card" size={24} color="#667eea" />
                  </View>
                  <View style={styles.paymentOptionInfo}>
                    <Text style={styles.paymentOptionTitle}>Tarjeta Bancaria</Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Recibe el pago directamente en tu cuenta
                    </Text>
                  </View>
                  {paymentMethod === 'card' && (
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Opción WhatsApp */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === 'whatsapp' && styles.paymentOptionSelected,
                ]}
                onPress={() => handlePaymentMethodSelect('whatsapp')}
              >
                <View style={styles.paymentOptionContent}>
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="logo-whatsapp" size={24} color="#25d366" />
                  </View>
                  <View style={styles.paymentOptionInfo}>
                    <Text style={styles.paymentOptionTitle}>WhatsApp</Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Contacta con soporte para coordinar el pago
                    </Text>
                  </View>
                  {paymentMethod === 'whatsapp' && (
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Formulario de Tarjeta */}
            {paymentMethod === 'card' && (
              <View style={styles.cardForm}>
                <Text style={styles.formTitle}>Datos de la Tarjeta</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Número de Tarjeta</Text>
                  <TextInput
                    style={styles.input}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Titular de la Tarjeta</Text>
                  <TextInput
                    style={styles.input}
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    placeholder="NOMBRE APELLIDO"
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Fecha de Vencimiento</Text>
                    <TextInput
                      style={styles.input}
                      value={expiryDate}
                      onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                      placeholder="MM/AA"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      value={cvv}
                      onChangeText={setCvv}
                      placeholder="123"
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Botones de Acción */}
            <View style={styles.actionButtons}>
              {paymentMethod === 'card' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleCardPayment}
                  disabled={isProcessing}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isProcessing ? (
                      <Text style={styles.buttonText}>Procesando...</Text>
                    ) : (
                      <Text style={styles.buttonText}>Procesar Pago</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {paymentMethod === 'whatsapp' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.whatsappButton]}
                  onPress={handleWhatsAppContact}
                >
                  <LinearGradient
                    colors={['#25d366', '#128c7e']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Contactar por WhatsApp</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    height: 120,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  prizeInfo: {
    padding: 20,
    alignItems: 'center',
  },
  prizeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  prizeAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  prizeSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  prizeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginHorizontal: 4,
  },
  prizeCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f59e0b',
  },
  prizeDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  paymentOptions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentOption: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardForm: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  actionButtons: {
    paddingHorizontal: 20,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  whatsappButton: {
    shadowColor: '#25d366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});
