import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const GeometricBackground: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Gradiente radial principal */}
      <LinearGradient
        colors={['#553c9a', '#805ad5', '#9f7aea']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Círculos decorativos grandes */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      
      {/* Círculos medianos */}
      <View style={[styles.circle, styles.circle4]} />
      <View style={[styles.circle, styles.circle5]} />
      
      {/* Círculos pequeños */}
      <View style={[styles.circle, styles.circle6]} />
      <View style={[styles.circle, styles.circle7]} />
      <View style={[styles.circle, styles.circle8]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  // Círculos grandes
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -50,
    opacity: 0.8,
  },
  circle2: {
    width: 180,
    height: 180,
    top: height * 0.3,
    left: -60,
    opacity: 0.7,
  },
  circle3: {
    width: 220,
    height: 220,
    top: height * 0.6,
    right: -80,
    opacity: 0.6,
  },
  // Círculos medianos
  circle4: {
    width: 120,
    height: 120,
    top: height * 0.2,
    left: width * 0.2,
    opacity: 0.5,
  },
  circle5: {
    width: 100,
    height: 100,
    top: height * 0.5,
    right: width * 0.15,
    opacity: 0.6,
  },
  // Círculos pequeños
  circle6: {
    width: 60,
    height: 60,
    top: height * 0.15,
    left: width * 0.4,
    opacity: 0.4,
  },
  circle7: {
    width: 80,
    height: 80,
    top: height * 0.4,
    right: width * 0.3,
    opacity: 0.5,
  },
  circle8: {
    width: 40,
    height: 40,
    top: height * 0.7,
    left: width * 0.6,
    opacity: 0.6,
  },
});
