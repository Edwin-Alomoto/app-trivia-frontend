import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../../shared/styles/common.styles';
import { authStyles } from '../../shared/styles/auth.styles';
import { Logo } from './Logo';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  title, 
  subtitle
}) => {
  return (
    <View style={commonStyles.headerSection}>
      <Logo size={80} />
      <Text style={authStyles.welcomeText}>{title}</Text>
      <Text style={authStyles.subtitleText}>{subtitle}</Text>
    </View>
  );
};
