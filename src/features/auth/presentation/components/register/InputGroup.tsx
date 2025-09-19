import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

interface InputGroupProps {
  children: React.ReactNode;
  title?: string;
  style?: any;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  title,
  style,
}) => {
  return (
    <View style={[styles.group, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
});
