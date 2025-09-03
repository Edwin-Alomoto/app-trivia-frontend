import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { authStyles } from '../../styles/auth.styles';

interface FormInputProps extends TextInputProps {
  label: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  placeholderTextColor,
  ...props 
}) => {
  return (
    <View style={authStyles.inputContainer}>
      <Text style={authStyles.inputLabel}>{label}</Text>
      <TextInput
        style={authStyles.input}
        placeholderTextColor={placeholderTextColor || '#b784fc'}
        {...props}
      />
    </View>
  );
};
