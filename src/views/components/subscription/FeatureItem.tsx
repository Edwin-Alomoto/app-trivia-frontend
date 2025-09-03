import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface FeatureItemProps {
  text: string;
  included: boolean;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ text, included }) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={included ? 'checkmark-circle' : 'close-circle'}
        size={20}
        color={included ? '#22c55e' : '#ef4444'}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
});
