import '@testing-library/jest-native/extend-expect';

// Silenciar warnings comunes en pruebas RN/Expo
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return {
    LinearGradient: ({ children }: any) => React.createElement('LinearGradient', null, children),
  };
});

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async () => undefined),
  getItemAsync: jest.fn(async () => null),
  deleteItemAsync: jest.fn(async () => undefined),
}));

// Mock de react-native-reanimated (recomendado por su guía de tests)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// RN Animated warning
try {
  // Algunos bundles de RN pueden no exponer esta ruta; hacerlo opcional evita fallos
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('react-native/Libraries/Animated/NativeAnimatedHelper');
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch {}


