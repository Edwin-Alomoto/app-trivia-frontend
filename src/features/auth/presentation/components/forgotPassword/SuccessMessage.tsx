import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface SuccessMessageProps {
  email: string;
  style?: any;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  email,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={48} color="#10B981" />
      </View>
      
      <Text style={[getVariantStyle('h2'), styles.title]}>
        ¡Correo enviado!
      </Text>
      
      <Text style={[getVariantStyle('body'), styles.subtitle]}>
        Hemos enviado un enlace de recuperación a:
      </Text>
      
      <Text style={[getVariantStyle('body'), styles.email]}>
        {email}
      </Text>
      
      <Text style={[getVariantStyle('body'), styles.instructions]}>
        Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    color: colors.primary600,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
