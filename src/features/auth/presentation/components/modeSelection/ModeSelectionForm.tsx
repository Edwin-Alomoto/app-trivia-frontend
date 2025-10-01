import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModeCard } from './ModeCard';

interface ModeSelectionFormProps {
  selectedMode: string | null;
  onModeSelect: (mode: string) => void;
  style?: any;
}

export const ModeSelectionForm: React.FC<ModeSelectionFormProps> = ({
  selectedMode,
  onModeSelect,
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
        description="Accede a funcionalidades limitadas y descubre todo lo que puedes hacer."
        icon="play-circle"
        features={demoFeatures}
        onPress={() => onModeSelect('demo')}
        isSelected={selectedMode === 'demo'}
        variant="demo"
      />

      {/* Modo Suscripción */}
      <ModeCard
        title="Suscripción Premium"
        subtitle="Acceso completo"
        description="Gana puntos ilimitados, accede a premios exclusivos y disfruta de la experiencia completa."
        icon="star"
        features={subscriptionFeatures}
        onPress={() => onModeSelect('subscription')}
        isSelected={selectedMode === 'subscription'}
        variant="subscription"
      />

      {/* Modales eliminados: se controlan desde ModeSelectionScreen */}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
});
