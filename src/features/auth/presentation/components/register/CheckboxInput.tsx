import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface CheckboxInputProps {
  checked: boolean;
  onToggle: () => void;
  text: string;
  linkText?: string;
  onLinkPress?: () => void;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  checked,
  onToggle,
  text,
  linkText,
  onLinkPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={12} color="#fff" />}
      </View>
      <Text style={[getVariantStyle('body'), styles.checkboxText]}>
        {text}
        {linkText && (
          <Text style={[getVariantStyle('body'), styles.linkText]} onPress={onLinkPress}>
            {' '}{linkText}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  checkboxText: {
    flex: 1,
    color: '#ffffff',
    lineHeight: 20,
  },
  linkText: {
    color: colors.gold,
    fontWeight: '600',
  },
});
