import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  style?: ViewStyle;
};

const RememberMeCheckbox: React.FC<Props> = ({ checked, onToggle, label = 'Mantener sesión iniciada', style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={10} color="#fff" />}
      </View>
      <Text style={[getVariantStyle('body'), styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  label: {
    color: colors.textSecondary,
  },
});

export default RememberMeCheckbox;


