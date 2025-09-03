import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DecorativeBackground: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Círculo decorativo grande - esquina superior derecha */}
      <View style={[styles.circle, styles.circle1]} />
      
      {/* Círculo decorativo mediano - esquina superior izquierda */}
      <View style={[styles.circle, styles.circle2]} />
      
      {/* Círculo decorativo pequeño - centro superior */}
      <View style={[styles.circle, styles.circle3]} />
      
      {/* Círculo decorativo mediano - esquina inferior derecha */}
      <View style={[styles.circle, styles.circle4]} />
      
      {/* Círculo decorativo pequeño - esquina inferior izquierda */}
      <View style={[styles.circle, styles.circle5]} />
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
    backgroundColor: '#ffffff', // Fondo blanco
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#9f7aea', // Púrpura ligeramente claro
    opacity: 0.08, // Muy sutil para no interferir
  },
  circle1: {
    width: 130,
    height: 130,
    top: height * 0.05, // Muy cerca del borde superior
    left: width * 0.35, // Centro izquierdo
  },
  circle2: {
    width: 100,
    height: 100,
    top: height * 0.2, // Centro superior
    right: width * 0.1, // Lado derecho
  },
  circle3: {
    width: 90,
    height: 90,
    top: height * 0.4, // Centro de la pantalla
    left: width * 0.25, // Lado izquierdo central
  },
  circle4: {
    width: 140,
    height: 140,
    bottom: height * 0.12, // Inferior izquierdo
    left: width * 0.08, // Muy cerca del borde izquierdo
  },
  circle5: {
    width: 110,
    height: 110,
    bottom: height * 0.06, // Muy cerca del borde inferior
    right: width * 0.3, // Centro derecho
  },
});
