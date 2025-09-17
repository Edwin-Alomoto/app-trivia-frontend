import React from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getVariantStyle } from '@theme/typography';
import { colors } from '@theme/colors';
import { timerDisplayStyles } from './TimerDisplay.styles';

interface TimerDisplayProps {
  timeLeft: number;
  timerAnimation: Animated.Value;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  timerAnimation,
}) => {
  const getTimerState = () => {
    const isCritical = timeLeft <= 10;
    const isWarning = timeLeft <= 20 && !isCritical;
    
    const timerBgColors = isCritical
      ? ['#ef4444', '#ef4444']
      : isWarning
      ? ['#f59e0b', '#f59e0b']
      : [colors.primary800, colors.primary600];
    
    const ringColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : colors.primary400;
    
    return { timerBgColors, ringColor };
  };

  const { timerBgColors, ringColor } = getTimerState();

  return (
    <Animated.View style={timerDisplayStyles.timerContainer}>
      <LinearGradient
        colors={timerBgColors as [string, string]}
        style={timerDisplayStyles.timerGradient}
      >
        <Ionicons name="time-outline" size={20} color="#fff" />
        <Text style={[getVariantStyle('subtitle'), timerDisplayStyles.timerText]}>
          {timeLeft}s
        </Text>
      </LinearGradient>
    
      <View style={[timerDisplayStyles.timerRing, { borderColor: `${ringColor}55` }]}>
        <Animated.View
          style={[
            timerDisplayStyles.timerRingFill,
            {
              borderColor: ringColor,
              transform: [
                {
                  rotate: timerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};
