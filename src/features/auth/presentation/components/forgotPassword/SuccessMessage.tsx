import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface SuccessMessageProps {
  email: string;
  onBackToLogin: () => void;
  style?: any;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  email,
  onBackToLogin,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={48} color={colors.gold} />
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
      
      <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
        <Text style={[getVariantStyle('body'), styles.backButtonText]}>
          Volver al login
        </Text>
      </TouchableOpacity>
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
    color: colors.gold,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    color: colors.gold,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  backButtonText: {
    color: colors.gold,
    textAlign: 'center',
    fontWeight: '600',
  },
});
