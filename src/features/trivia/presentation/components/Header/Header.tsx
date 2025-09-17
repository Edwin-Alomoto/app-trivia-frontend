import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { headerStyles } from './Header.styles';

interface HeaderProps {
  title: string;
  subtitle: string;
  onBackPress: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  fadeAnim,
  slideAnim,
}) => {
  return (
    <Animated.View 
      style={[
        headerStyles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={headerStyles.headerGradient}>
        <View style={headerStyles.headerContent}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={headerStyles.headerInfo}>
            <Text style={[getVariantStyle('h1'), headerStyles.title]}>{title}</Text>
            <Text style={[getVariantStyle('subtitle'), headerStyles.subtitle]}>{subtitle}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
