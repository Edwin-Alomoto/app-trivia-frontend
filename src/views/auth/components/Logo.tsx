import React from 'react';
import { View, Image, ImageStyle } from 'react-native';
import { authStyles } from '../../shared/styles/auth.styles';

interface LogoProps {
  size?: number;
  style?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 80, 
  style 
}) => {
  return (
    <View style={[authStyles.logoContainer, { width: size, height: size }]}>
      <Image
        source={require('../../../../assets/logo.jpg')}
        style={[
          {
            width: size,
            height: size,
          },
          style
        ]}
        resizeMode="cover"
      />
    </View>
  );
};
