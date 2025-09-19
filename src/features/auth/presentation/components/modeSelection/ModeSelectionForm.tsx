import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModeCard } from './ModeCard';
import { DemoModal } from './DemoModal';
import { SubscriptionModal } from './SubscriptionModal';

interface ModeSelectionFormProps {
  selectedMode: string | null;
  onModeSelect: (mode: string) => void;
  onDemoConfirm: () => void;
  onSubscriptionConfirm: () => void;
  showDemoModal: boolean;
  showSubscriptionModal: boolean;
  onCloseDemoModal: () => void;
  onCloseSubscriptionModal: () => void;
  style?: any;
}

export const ModeSelectionForm: React.FC<ModeSelectionFormProps> = ({
  selectedMode,
  onModeSelect,
  onDemoConfirm,
  onSubscriptionConfirm,
  showDemoModal,
  showSubscriptionModal,
  onCloseDemoModal,
  onCloseSubscriptionModal,
  style,
}) => {
  const demoFeatures = [
    'Acceso limitado a funcionalidades',
    'Puntos de demostración',
    'Experiencia completa por 7 días',
    'Sin compromiso de suscripción'
  ];

  const subscriptionFeatures = [
    'Acceso completo a todas las funcionalidades',
    'Puntos ilimitados',
    'Premios exclusivos',
    'Soporte prioritario'
  ];

  return (
    <View style={[styles.form, style]}>
      {/* Modo Demo */}
      <ModeCard
        title="Modo Demo"
        subtitle="Prueba gratuita"
        description="Experimenta WinUp por 7 días sin compromiso. Accede a funcionalidades limitadas y descubre todo lo que puedes hacer."
        icon="play-circle"
        features={demoFeatures}
        onPress={() => onModeSelect('demo')}
        isSelected={selectedMode === 'demo'}
      />

      {/* Modo Suscripción */}
      <ModeCard
        title="Suscripción Premium"
        subtitle="Acceso completo"
        description="Desbloquea todas las funcionalidades de WinUp. Gana puntos ilimitados, accede a premios exclusivos y disfruta de la experiencia completa."
        icon="star"
        features={subscriptionFeatures}
        onPress={() => onModeSelect('subscription')}
        isSelected={selectedMode === 'subscription'}
      />

      {/* Modales */}
      <DemoModal
        visible={showDemoModal}
        onClose={onCloseDemoModal}
        onConfirm={onDemoConfirm}
      />

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={onCloseSubscriptionModal}
        onConfirm={onSubscriptionConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
});
