import { Animated } from 'react-native';

// Tipos para configuraciones de animación
export interface AnimationTimingConfig {
  duration: number;
  delay?: number;
  useNativeDriver?: boolean;
}

export interface AnimationSpringConfig {
  tension: number;
  friction: number;
  delay?: number;
  useNativeDriver?: boolean;
}

// Tipos para diferentes estilos de animación
export type AnimationType = 
  | 'fadeIn'
  | 'slideIn'
  | 'scaleIn'
  | 'pulse'
  | 'bounce'
  | 'shake'
  | 'rotate'
  | 'slideUp'
  | 'slideDown'
  | 'zoomIn'
  | 'zoomOut';

// Configuración de animaciones predefinidas
export interface AnimationPreset {
  name: string;
  fadeIn?: AnimationTimingConfig;
  slideIn?: AnimationTimingConfig & { fromY?: number; fromX?: number };
  scaleIn?: AnimationSpringConfig & { fromScale?: number };
  pulse?: AnimationTimingConfig & { minScale?: number; maxScale?: number; loop?: boolean };
}

// Presets de animación comunes
export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  // Animación suave para login
  login: {
    name: 'login',
    fadeIn: { duration: 1000, delay: 0 },
    slideIn: { duration: 800, delay: 0, fromY: 20 },
    scaleIn: { duration: 800, delay: 0, fromScale: 0.98, tension: 100, friction: 8 },
  },
  
  // Animación rápida para pantallas
  screen: {
    name: 'screen',
    fadeIn: { duration: 800, delay: 0 },
    slideIn: { duration: 600, delay: 0, fromY: 30 },
    scaleIn: { duration: 600, delay: 0, fromScale: 0.9, tension: 50, friction: 7 },
  },
  
  // Animación para cards
  card: {
    name: 'card',
    fadeIn: { duration: 600, delay: 0 },
    slideIn: { duration: 400, delay: 0, fromY: 20 },
    scaleIn: { duration: 400, delay: 0, fromScale: 0.95, tension: 80, friction: 6 },
  },
  
  // Animación para modales
  modal: {
    name: 'modal',
    fadeIn: { duration: 300, delay: 0 },
    slideIn: { duration: 300, delay: 0, fromY: 50 },
    scaleIn: { duration: 300, delay: 0, fromScale: 0.8, tension: 120, friction: 8 },
  },
  
  // Animación para elementos de lista
  listItem: {
    name: 'listItem',
    fadeIn: { duration: 500, delay: 0 },
    slideIn: { duration: 400, delay: 0, fromY: 30 },
    scaleIn: { duration: 400, delay: 0, fromScale: 0.9, tension: 60, friction: 5 },
  },
  
  // Animación de entrada rápida
  quick: {
    name: 'quick',
    fadeIn: { duration: 300, delay: 0 },
    slideIn: { duration: 200, delay: 0, fromY: 10 },
    scaleIn: { duration: 200, delay: 0, fromScale: 0.98, tension: 150, friction: 10 },
  },
  
  // Animación dramática
  dramatic: {
    name: 'dramatic',
    fadeIn: { duration: 1500, delay: 200 },
    slideIn: { duration: 1200, delay: 100, fromY: 100 },
    scaleIn: { duration: 1200, delay: 0, fromScale: 0.7, tension: 80, friction: 6 },
  },
};

// Tipos para valores de animación
export interface AnimationValues {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  rotateAnim?: Animated.Value;
  translateXAnim?: Animated.Value;
  translateYAnim?: Animated.Value;
}

// Tipos para callbacks de animación
export type AnimationCallback = () => void;
export type AnimationCompleteCallback = (finished?: boolean) => void;

// Tipos para configuraciones de animación avanzadas
export interface AdvancedAnimationConfig {
  preset?: keyof typeof ANIMATION_PRESETS;
  custom?: Partial<AnimationPreset>;
  stagger?: {
    enabled: boolean;
    delay: number;
  };
  loop?: {
    enabled: boolean;
    count?: number;
  };
  reverse?: boolean;
  onComplete?: AnimationCompleteCallback;
}

// Tipos para animaciones de transición
export interface TransitionAnimation {
  from: AnimationValues;
  to: AnimationValues;
  duration: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// Tipos para animaciones de gestos
export interface GestureAnimation {
  panX?: Animated.Value;
  panY?: Animated.Value;
  scale?: Animated.Value;
  rotation?: Animated.Value;
}

// Tipos para animaciones de scroll
export interface ScrollAnimation {
  scrollY: Animated.Value;
  parallax?: {
    enabled: boolean;
    speed: number;
  };
  sticky?: {
    enabled: boolean;
    offset: number;
  };
}
