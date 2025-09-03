import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SubscriptionCard, DemoModal, PremiumModal } from './components';
import { DecorativeBackground } from '../shared/components/DecorativeBackground';
import { theme } from '../shared/styles/theme';

interface SubscriptionViewProps {
  onBackToLogin: () => void;
}

export default function SubscriptionView({ onBackToLogin }: SubscriptionViewProps) {
  const [isDemoModalVisible, setIsDemoModalVisible] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  const handleDemoSelection = () => {
    setIsDemoModalVisible(true);
  };

  const handleStartDemo = () => {
    setIsDemoModalVisible(false);
    // Aquí puedes agregar la lógica para activar el modo demo
    console.log('Modo demo activado');
  };

  const handleCloseDemoModal = () => {
    setIsDemoModalVisible(false);
  };

  const handlePremiumSelection = () => {
    setIsPremiumModalVisible(true);
  };

  const handleSubscribe = () => {
    setIsPremiumModalVisible(false);
    // Aquí puedes agregar la lógica para procesar el pago
    console.log('Suscripción premium seleccionada');
  };

  const handleClosePremiumModal = () => {
    setIsPremiumModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <DecorativeBackground />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Elige tu plan perfecto</Text>
        </View>

        {/* Subscription Cards */}
        <View style={styles.cardsContainer}>
          <SubscriptionCard
            type="demo"
            onSelect={handleDemoSelection}
          />
          
          <SubscriptionCard
            type="premium"
            onSelect={handlePremiumSelection}
          />
        </View>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <Text style={styles.backButton} onPress={onBackToLogin}>
            ← Volver al inicio de sesión
          </Text>
        </View>
      </ScrollView>

      {/* Demo Modal */}
      <DemoModal
        visible={isDemoModalVisible}
        onClose={handleCloseDemoModal}
        onStartDemo={handleStartDemo}
      />

      {/* Premium Modal */}
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        onSubscribe={handleSubscribe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxxxl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 32,
  },
  cardsContainer: {
    flex: 1,
  },
  backButtonContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  backButton: {
    color: theme.colors.link.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
});
