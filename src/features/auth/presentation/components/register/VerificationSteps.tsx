import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface VerificationStepsProps {
  style?: any;
}

export const VerificationSteps: React.FC<VerificationStepsProps> = ({
  style,
}) => {
  const steps = [
    { number: 1, text: 'Abre tu aplicación de correo' },
    { number: 2, text: 'Busca el correo de WinUp' },
    { number: 3, text: 'Haz clic en Verificar cuenta' },
  ];

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={[getVariantStyle('body'), styles.stepNumberText]}>
              {step.number}
            </Text>
          </View>
          <Text style={[getVariantStyle('body'), styles.stepText]}>
            {step.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
  stepText: {
    color: colors.textPrimary,
    flex: 1,
  },
});
