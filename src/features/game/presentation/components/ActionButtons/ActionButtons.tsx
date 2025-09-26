import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { gradients } from '@theme/gradients';
import { actionButtonsStyles } from './ActionButtons.styles';

interface ActionButtonsProps {
  currentSession?: {
    sessionHintsUsed?: number;
  };
  isAnswered: boolean;
  handleUseHint: () => void;
  handleSkip: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentSession,
  isAnswered,
  handleUseHint,
  handleSkip,
  fadeAnim,
  slideAnim,
}) => {
  const hintsUsed = currentSession?.sessionHintsUsed ?? 0;
  const hintsRemaining = Math.max(0, 2 - hintsUsed);
  const isHintDisabled = hintsUsed >= 2 || isAnswered;

  return (
    <Animated.View 
      style={[
        actionButtonsStyles.actionsContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={actionButtonsStyles.actionButtonsRow}>
        <TouchableOpacity
          style={actionButtonsStyles.hintButton}
          onPress={handleUseHint}
          disabled={isHintDisabled}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Usar pista"
          accessibilityHint="Elimina opciones incorrectas"
        >
          <LinearGradient
            colors={isHintDisabled ? ['#e5e7eb', '#cbd5e1'] : (gradients.brand as unknown as [string, string])}
            style={actionButtonsStyles.hintButtonGradient}
          >
            <Ionicons name="bulb-outline" size={20} color="#fff" />
            <Text style={[getVariantStyle('subtitle'), actionButtonsStyles.hintButtonText]}>
              Pista ({hintsRemaining})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={actionButtonsStyles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Omitir pregunta"
          accessibilityHint="Pasa a la siguiente pregunta"
        >
          <Text style={[getVariantStyle('subtitle'), actionButtonsStyles.skipButtonText]}>
            Omitir pregunta
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
