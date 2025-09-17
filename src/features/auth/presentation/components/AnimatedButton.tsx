import React, { useRef } from 'react';
import { Animated, TouchableOpacityProps, TouchableOpacity } from 'react-native';

interface AnimatedButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ isLoading, style, children, ...rest }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 120,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedButton;
