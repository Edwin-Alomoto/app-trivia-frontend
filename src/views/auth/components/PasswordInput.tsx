import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { authStyles } from '../../shared/styles/auth.styles';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  label, 
  placeholderTextColor,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={authStyles.inputContainer}>
      <Text style={authStyles.inputLabel}>{label}</Text>
      <View style={authStyles.passwordContainer}>
        <TextInput
          style={authStyles.passwordInput}
          secureTextEntry={!showPassword}
          placeholderTextColor={placeholderTextColor || '#b784fc'}
          {...props}
        />
        <TouchableOpacity 
          style={authStyles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={authStyles.eyeIcon}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
