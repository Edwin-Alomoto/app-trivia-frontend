import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  style?: any;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title = "¡Bienvenido a WinUp!",
  subtitle = "Acumula puntos y gana premios.",
  showLogo = true,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Text style={[getVariantStyle('h1'), styles.title]}>
            {title}
          </Text>
          <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>
            {subtitle}
          </Text>
        </View>
      )}
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
