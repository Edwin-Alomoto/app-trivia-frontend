import React from 'react';
import { View, Text, Image, ViewStyle, StyleSheet } from 'react-native';
import { getVariantStyle } from '@theme/typography';
import { colors } from '@theme/colors';

type Props = {
  title: string;
  subtitle?: string;
  logoSource?: any;
  containerStyle?: ViewStyle;
  logoStyle?: ViewStyle;
};

const LoginHeader: React.FC<Props> = ({ title, subtitle, logoSource, containerStyle, logoStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {logoSource ? (
        <Image source={logoSource} style={[styles.logoImage, logoStyle]} resizeMode="contain" />
      ) : null}
      <Text style={[getVariantStyle('h1'), { color: colors.textPrimary }]}>{title}</Text>
      {!!subtitle && (
        <Text style={[getVariantStyle('subtitle'), { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 28,
  },
});

export default LoginHeader;


