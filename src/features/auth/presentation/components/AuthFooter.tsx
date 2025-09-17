import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

type Props = {
  questionText: string;
  actionText: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const AuthFooter: React.FC<Props> = ({ questionText, actionText, onPress, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[getVariantStyle('body'), styles.footerText]}>{questionText} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[getVariantStyle('body'), styles.linkText]}>
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default AuthFooter;


