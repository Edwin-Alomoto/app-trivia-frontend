import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

interface FormSectionProps {
  children: React.ReactNode;
  style?: any;
}

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[styles.section, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
});
