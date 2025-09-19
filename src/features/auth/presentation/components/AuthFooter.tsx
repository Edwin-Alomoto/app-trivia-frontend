import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkPress: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  onLinkPress,
}) => {
  return (
    <View style={styles.footer}>
      <Text style={[getVariantStyle('body'), styles.footerText]}>{text}</Text>
      <TouchableOpacity onPress={onLinkPress}>
        <Text style={[getVariantStyle('body'), styles.linkText, styles.boldText]}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary600,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '600',
  },
});
