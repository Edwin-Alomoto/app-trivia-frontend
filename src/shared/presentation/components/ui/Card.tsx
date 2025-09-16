import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: boolean;
  gradientColors?: string[];
  elevation?: number;
  borderRadius?: number;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  gradient = false,
  gradientColors = ['#fff', '#f8f9fa'],
  elevation = 2,
  borderRadius = 16,
  padding = 16,
}) => {
  const cardStyle = [
    styles.card,
    {
      borderRadius,
      padding,
      shadowOpacity: elevation * 0.1,
      shadowRadius: elevation * 2,
      elevation,
    },
    style,
  ];

  if (gradient) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.9 : 1}
      >
        <LinearGradient
          colors={gradientColors as [string, string, string]}
          style={[styles.gradient, { borderRadius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  gradient: {
    flex: 1,
  },
});


