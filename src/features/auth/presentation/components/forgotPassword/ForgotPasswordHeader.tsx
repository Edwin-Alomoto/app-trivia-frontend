import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface ForgotPasswordHeaderProps {
  title?: string;
  subtitle?: string;
  style?: any;
}

export const ForgotPasswordHeader: React.FC<ForgotPasswordHeaderProps> = ({
  title = "¿Olvidaste tu contraseña?",
  subtitle = "No te preocupes, te ayudamos a recuperarla.",
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={[getVariantStyle('h1'), styles.title]}>
        {title}
      </Text>
      <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
