import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface RegisterHeaderProps {
  title?: string;
  subtitle?: string;
  style?: any;
}

export const RegisterHeader: React.FC<RegisterHeaderProps> = ({
  title = "¡Únete a WinUp!",
  subtitle = "Regístrate y empieza a ganar",
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.logoContainer}>
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
