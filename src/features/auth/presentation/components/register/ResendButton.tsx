import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { getVariantStyle } from '@theme/typography';

interface ResendButtonProps {
  onPress: () => void;
  disabled: boolean;
  timer: number;
  style?: any;
}

export const ResendButton: React.FC<ResendButtonProps> = ({
  onPress,
  disabled,
  timer,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="refresh" 
        size={16} 
        color={disabled ? '#94a3b8' : colors.primary600} 
      />
      <Text style={[
        getVariantStyle('body'),
        styles.buttonText,
        disabled && styles.buttonTextDisabled
      ]}>
        {timer > 0 
          ? `Reenviar en ${timer}s` 
          : 'Reenviar verificación'
        }
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary600,
    backgroundColor: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.6,
    borderColor: '#cbd5e1',
  },
  buttonText: {
    color: colors.primary600,
    marginLeft: 8,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#94a3b8',
  },
});
