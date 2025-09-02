import React, { useState } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, Animated } from 'react-native';
import { authStyles } from '../../styles/auth.styles';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  title, 
  loading = false, 
  disabled = false,
  style,
  ...props 
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          authStyles.primaryButton, 
          disabled && authStyles.primaryButtonDisabled,
          style
        ]}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        {...props}
      >
        <Text style={authStyles.primaryButtonText}>
          {loading ? 'Cargando...' : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
