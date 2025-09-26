import React from 'react';
import { Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getVariantStyle } from '@theme/typography';
import { pointsAnimationStyles } from './PointsAnimation.styles';

interface PointsAnimationProps {
  scoreAnimation: Animated.Value;
  currentQuestion?: {
    points?: number;
  };
}

export const PointsAnimation: React.FC<PointsAnimationProps> = ({
  scoreAnimation,
  currentQuestion,
}) => {
  return (
    <Animated.View
      style={[
        pointsAnimationStyles.scoreAnimation,
        {
          opacity: scoreAnimation,
          transform: [
            {
              scale: scoreAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.5],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={pointsAnimationStyles.scoreAnimationGradient}
      >
        <Text style={[getVariantStyle('subtitle'), pointsAnimationStyles.scoreAnimationText]}>
          +{currentQuestion?.points || 0}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};
