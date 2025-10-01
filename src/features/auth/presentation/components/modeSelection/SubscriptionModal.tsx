import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

import { AuthButton } from '../AuthButton';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  style?: any;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  style,
}) => {
  const features = [
    'Acceso completo a todas las funcionalidades',
    'Puntos ilimitados',
    'Premios exclusivos',
    'Soporte prioritario'
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, style]}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Ionicons name="star" size={48} color="#10b981" />
            <Text style={[getVariantStyle('h2'), styles.title]}>
              ¡Suscríbete a WinUp!
            </Text>
            <Text style={[getVariantStyle('body'), styles.subtitle]}>
              Desbloquea todas las funcionalidades
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.features}>
              <Text style={[getVariantStyle('h4'), styles.featuresTitle]}>
                ¿Qué incluye la suscripción?
              </Text>
              <View style={styles.featuresList}>
                {features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={[getVariantStyle('body'), styles.featureText]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.price}>
              <View style={styles.priceRow}>
                <Text style={[getVariantStyle('h1'), styles.priceAmount]}>
                  $9.99
                </Text>
                <Text style={[getVariantStyle('body'), styles.pricePeriod]}>
                  /mes
                </Text>
              </View>
              <Text style={[getVariantStyle('body'), styles.priceRenewal]}>
                Se renueva automáticamente
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={[getVariantStyle('body'), styles.cancelButtonText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <AuthButton
                title="Suscribirse"
                onPress={onConfirm}
                variant="primary"
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#dcfce7',
  },
  title: {
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: 28,
  },
  features: {
    marginBottom: 28,
  },
  featuresTitle: {
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  price: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceAmount: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  pricePeriod: {
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceRenewal: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
  },
});
