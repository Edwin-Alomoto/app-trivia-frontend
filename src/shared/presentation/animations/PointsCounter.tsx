import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface PointsCounterProps {
  value: number;
  duration?: number;
  style?: any;
  textStyle?: any;
}

export const PointsCounter: React.FC<PointsCounterProps> = ({
  value,
  duration = 1000,
  style,
  textStyle,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value, duration, animatedValue]);

  return (
    <Animated.View style={style}>
      <Animated.Text style={[styles.text, textStyle]}>
        {animatedValue.interpolate ? Math.floor((animatedValue as any)._value || 0).toLocaleString() : value}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});


