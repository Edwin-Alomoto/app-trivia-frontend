import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
}

interface PointsParticlesProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const PointsParticles: React.FC<PointsParticlesProps> = ({
  trigger,
  onComplete,
}) => {
  const particles = useRef<Particle[]>([]);
  const [particleComponents, setParticleComponents] = React.useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (trigger) {
      createParticles();
    }
  }, [trigger]);

  const createParticles = () => {
    const newParticles: Particle[] = [];
    const newComponents: React.ReactNode[] = [];

    for (let i = 0; i < 10; i++) {
      const particle: Particle = {
        id: i,
        x: new Animated.Value(screenWidth / 2),
        y: new Animated.Value(screenHeight / 2),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        rotation: new Animated.Value(0),
      };

      newParticles.push(particle);

      const randomX = (Math.random() - 0.5) * screenWidth * 0.8;
      const randomY = (Math.random() - 0.5) * screenHeight * 0.6;
      const randomRotation = Math.random() * 360;

      // Animaciones paralelas para cada partícula
      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: screenWidth / 2 + randomX,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(particle.y, {
          toValue: screenHeight / 2 + randomY,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 1300,
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(particle.rotation, {
          toValue: randomRotation,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (i === newParticles.length - 1 && onComplete) {
          onComplete();
        }
      });

      const component = (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            transform: [
              { scale: particle.scale },
              {
                rotate: particle.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            opacity: particle.opacity,
          }}
        >
          <Ionicons 
            name={Math.random() > 0.5 ? 'star' : 'diamond'} 
            size={20} 
            color="#FFD700" 
          />
        </Animated.View>
      );

      newComponents.push(component);
    }

    particles.current = newParticles;
    setParticleComponents(newComponents);

    // Limpiar después de la animación
    setTimeout(() => {
      setParticleComponents([]);
    }, 1600);
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {particleComponents}
    </View>
  );
};
