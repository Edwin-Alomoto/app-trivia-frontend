import React, { ReactNode } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useGlobalAnimations, AnimationConfig, AnimationValues } from '@shared/domain/hooks/useGlobalAnimations';

interface AnimatedContainerProps {
  children: ReactNode;
  config?: AnimationConfig;
  style?: ViewStyle;
  animatedStyle?: (values: AnimationValues) => ViewStyle;
  onAnimationComplete?: () => void;
  disabled?: boolean;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  config,
  style,
  animatedStyle,
  onAnimationComplete,
  disabled = false,
}) => {
  const { animationValues } = useGlobalAnimations(config);

  React.useEffect(() => {
    if (onAnimationComplete) {
      // Simular callback después de que las animaciones se completen
      const timer = setTimeout(onAnimationComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete]);

  if (disabled) {
    return <>{children}</>;
  }

  const defaultAnimatedStyle: ViewStyle = {
    opacity: animationValues.fadeAnim,
    transform: [
      { translateY: animationValues.slideAnim },
      { scale: animationValues.scaleAnim },
    ],
  };

  const finalStyle = animatedStyle 
    ? animatedStyle(animationValues)
    : defaultAnimatedStyle;

  return (
    <Animated.View style={[finalStyle, style]}>
      {children}
    </Animated.View>
  );
};

// Componente específico para pantallas
export const AnimatedScreen: React.FC<Omit<AnimatedContainerProps, 'config'>> = (props) => {
  return (
    <AnimatedContainer
      {...props}
      config={{
        fadeIn: { duration: 1000 },
        slideIn: { fromY: 20, duration: 800 },
        scaleIn: { fromScale: 0.98, tension: 100, friction: 8 },
      }}
    />
  );
};

// Componente para cards
export const AnimatedCard: React.FC<Omit<AnimatedContainerProps, 'config'>> = (props) => {
  return (
    <AnimatedContainer
      {...props}
      config={{
        fadeIn: { duration: 600 },
        slideIn: { fromY: 20, duration: 400 },
        scaleIn: { fromScale: 0.95, tension: 80, friction: 6 },
      }}
    />
  );
};

// Componente para elementos de lista
export const AnimatedListItem: React.FC<Omit<AnimatedContainerProps, 'config'> & { index?: number }> = ({ 
  index = 0, 
  ...props 
}) => {
  return (
    <AnimatedContainer
      {...props}
      config={{
        fadeIn: { duration: 500, delay: index * 100 },
        slideIn: { fromY: 30, duration: 400, delay: index * 100 },
        scaleIn: { fromScale: 0.9, tension: 60, friction: 5 },
      }}
    />
  );
};

// Componente para modales
export const AnimatedModal: React.FC<Omit<AnimatedContainerProps, 'config'>> = (props) => {
  return (
    <AnimatedContainer
      {...props}
      config={{
        fadeIn: { duration: 300 },
        slideIn: { fromY: 50, duration: 300 },
        scaleIn: { fromScale: 0.8, tension: 120, friction: 8 },
      }}
      animatedStyle={(values) => ({
        opacity: values.fadeAnim,
        transform: [
          { translateY: values.slideAnim },
          { scale: values.scaleAnim },
        ],
      })}
    />
  );
};
