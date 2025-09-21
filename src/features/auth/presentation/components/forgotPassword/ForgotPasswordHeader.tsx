import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../../../assets/adaptive-icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={[getVariantStyle('h1'), styles.title]}>
          {title}
        </Text>
        <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 16,
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
