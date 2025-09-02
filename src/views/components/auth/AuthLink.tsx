import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { authStyles } from '../../styles/auth.styles';

interface AuthLinkProps extends TouchableOpacityProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const AuthLink: React.FC<AuthLinkProps> = ({ 
  text, 
  linkText, 
  onPress,
  ...props 
}) => {
  return (
    <TouchableOpacity 
      style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      onPress={onPress}
      {...props}
    >
      <Text style={authStyles.signUpText}>{text} </Text>
      <Text style={authStyles.signUpButtonText}>{linkText}</Text>
    </TouchableOpacity>
  );
};
