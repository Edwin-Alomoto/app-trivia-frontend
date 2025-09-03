import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ 
  visible, 
  onClose, 
  onSubscribe 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="diamond" size={24} color="white" />
            </View>
            <Text style={styles.title}>Suscripción Premium</Text>
            <Text style={styles.subtitle}>
              Acceso completo mensual renovable
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>
              Con Premium obtienes:
            </Text>
            
            <View style={styles.featureItem}>
              <Ionicons name="infinite" size={20} color="#10B981" />
              <Text style={styles.featureText}>Trivia ilimitada</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="chatbubble" size={20} color="#10B981" />
              <Text style={styles.featureText}>Encuestas exclusivas</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="diamond" size={20} color="#10B981" />
              <Text style={styles.featureText}>Puntos canjeables</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="gift" size={20} color="#10B981" />
              <Text style={styles.featureText}>Premios reales</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={20} color="#10B981" />
              <Text style={styles.featureText}>Sorteos exclusivos</Text>
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.pricingSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$9.99</Text>
              <View style={styles.priceDetails}>
                <Text style={styles.pricePerMonth}>por mes</Text>
                <Text style={styles.renewalText}>Renovación automática mensual</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
              <Ionicons name="diamond" size={16} color="white" />
              <Text style={styles.subscribeButtonText}>Suscribirme</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: theme.spacing.xl,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  pricingSection: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
    backgroundColor: '#dcfce7',
    padding: theme.spacing.md,
    borderRadius: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
  },
  priceDetails: {
    justifyContent: 'center',
  },
  pricePerMonth: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  renewalText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
