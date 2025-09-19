import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  title, 
  subtitle, 
  showLogo = true 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {showLogo && (
          <Image 
            source={require('../../../../assets/adaptive-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        )}
        <Text style={[getVariantStyle('h1'), styles.title]}>{title}</Text>
        <Text style={[getVariantStyle('subtitle'), styles.subtitle]}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 28,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
