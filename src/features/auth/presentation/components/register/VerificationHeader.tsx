import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface VerificationHeaderProps {
  email: string;
  style?: any;
}

export const VerificationHeader: React.FC<VerificationHeaderProps> = ({
  email,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <Ionicons name="mail" size={32} color="#10B981" />
      <Text style={[getVariantStyle('h2'), styles.title]}>
        ¡Revisa tu correo!
      </Text>
      <Text style={[getVariantStyle('body'), styles.subtitle]}>
        Hemos enviado un enlace de verificación a:
      </Text>
      <Text style={[getVariantStyle('body'), styles.email]}>
        {email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 28,
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
    marginBottom: 4,
  },
  email: {
    color: colors.primary600,
    fontWeight: '600',
    textAlign: 'center',
  },
});
