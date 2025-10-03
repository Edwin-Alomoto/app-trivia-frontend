import { useState, useEffect, useRef } from 'react';
import { Animated, AnimatedValue } from 'react-native';

export interface AnimationConfig {
  fadeIn?: {
    duration?: number;
    delay?: number;
  };
  slideIn?: {
    fromY?: number;
    duration?: number;
    delay?: number;
  };
  scaleIn?: {
    fromScale?: number;
    duration?: number;
    delay?: number;
    tension?: number;
    friction?: number;
  };
  pulse?: {
    minScale?: number;
    maxScale?: number;
    duration?: number;
    loop?: boolean;
  };
}

export interface AnimationValues {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
}

const DEFAULT_CONFIG: Required<AnimationConfig> = {
  fadeIn: {
    duration: 1000,
    delay: 0,
  },
  slideIn: {
    fromY: 20,
    duration: 800,
    delay: 0,
  },
  scaleIn: {
    fromScale: 0.98,
    duration: 800,
    delay: 0,
    tension: 100,
    friction: 8,
  },
  pulse: {
    minScale: 1,
    maxScale: 1.05,
    duration: 2000,
    loop: true,
  },
};

export const useGlobalAnimations = (config?: AnimationConfig) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Crear valores de animación
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(mergedConfig.slideIn.fromY))[0];
  const scaleAnim = useState(new Animated.Value(mergedConfig.scaleIn.fromScale))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const animationValues: AnimationValues = {
    fadeAnim,
    slideAnim,
    scaleAnim,
    pulseAnim,
  };

  // Función para ejecutar animaciones de entrada
  const startEntranceAnimations = () => {
    const animations = [];

    // Fade in
    if (mergedConfig.fadeIn) {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: mergedConfig.fadeIn.duration,
          delay: mergedConfig.fadeIn.delay,
          useNativeDriver: true,
        })
      );
    }

    // Slide in
    if (mergedConfig.slideIn) {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: mergedConfig.slideIn.duration,
          delay: mergedConfig.slideIn.delay,
          useNativeDriver: true,
        })
      );
    }

    // Scale in
    if (mergedConfig.scaleIn) {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: mergedConfig.scaleIn.tension,
          friction: mergedConfig.scaleIn.friction,
          delay: mergedConfig.scaleIn.delay,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  // Función para animación de pulso
  const startPulseAnimation = () => {
    if (!mergedConfig.pulse.loop) {
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: mergedConfig.pulse.maxScale,
          duration: mergedConfig.pulse.duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: mergedConfig.pulse.minScale,
          duration: mergedConfig.pulse.duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Función para animación de salida
  const startExitAnimations = (callback?: () => void) => {
    const animations = [];

    animations.push(
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start(() => {
      callback?.();
    });
  };

  // Función para animación de bounce en botones
  const bounceAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Función para animación de shake en errores
  const shakeAnimation = () => {
    const shakeAnim = new Animated.Value(0);
    
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    return shakeAnim;
  };

  // Función para resetear animaciones
  const resetAnimations = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(mergedConfig.slideIn.fromY);
    scaleAnim.setValue(mergedConfig.scaleIn.fromScale);
    pulseAnim.setValue(1);
  };

  // Auto-iniciar animaciones de entrada al montar
  useEffect(() => {
    startEntranceAnimations();
    
    if (mergedConfig.pulse.loop) {
      startPulseAnimation();
    }
  }, []);

  return {
    animationValues,
    startEntranceAnimations,
    startExitAnimations,
    startPulseAnimation,
    bounceAnimation,
    shakeAnimation,
    resetAnimations,
  };
};

// Hook simplificado para animaciones básicas
export const useBasicAnimations = () => {
  return useGlobalAnimations({
    fadeIn: { duration: 800 },
    slideIn: { fromY: 30, duration: 600 },
    scaleIn: { fromScale: 0.9, tension: 50, friction: 7 },
  });
};

// Hook para animaciones de login
export const useLoginAnimations = () => {
  return useGlobalAnimations({
    fadeIn: { duration: 1000 },
    slideIn: { fromY: 20, duration: 800 },
    scaleIn: { fromScale: 0.98, tension: 100, friction: 8 },
  });
};

// Hook para animaciones de cards
export const useCardAnimations = () => {
  return useGlobalAnimations({
    fadeIn: { duration: 600 },
    slideIn: { fromY: 20, duration: 400 },
    scaleIn: { fromScale: 0.95, tension: 80, friction: 6 },
  });
};
