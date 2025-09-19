import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';
import { AuthButton } from '../AuthButton';

interface DemoModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  style?: any;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  visible,
  onClose,
  onConfirm,
  style,
}) => {
  const features = [
    'Acceso limitado a funcionalidades',
    'Puntos de demostración',
    'Experiencia completa por 7 días',
    'Sin compromiso de suscripción'
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
            <Ionicons name="play-circle" size={48} color="#6366f1" />
            <Text style={[getVariantStyle('h2'), styles.title]}>
              ¡Prueba WinUp!
            </Text>
            <Text style={[getVariantStyle('body'), styles.subtitle]}>
              Experimenta todas las funcionalidades por 7 días
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.features}>
              <Text style={[getVariantStyle('h4'), styles.featuresTitle]}>
                ¿Qué incluye el modo demo?
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

            <View style={styles.warning}>
              <Ionicons name="information-circle" size={20} color="#f59e0b" />
              <Text style={[getVariantStyle('body'), styles.warningText]}>
                Al finalizar el período de prueba, necesitarás una suscripción para continuar usando WinUp.
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
                title="Comenzar demo"
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
    backgroundColor: '#e0e7ff',
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
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
    marginTop: 16,
  },
  warningText: {
    color: '#b45309',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
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
