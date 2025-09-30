// Exportar todos los assets para facilitar su uso
export { default as Icon } from './icon.png';
export { default as AdaptiveIcon } from './adaptive-icon.png';
export { default as Favicon } from './favicon.png';
export { default as SplashIcon } from './splash-icon.png';
export { default as Background } from './background.jpg';
export { default as Letter } from './letter.png';

// Re-exportar para compatibilidad
export const assets = {
  icon: require('./icon.png'),
  adaptiveIcon: require('./adaptive-icon.png'),
  favicon: require('./favicon.png'),
  splashIcon: require('./splash-icon.png'),
  background: require('./background.jpg'),
  letter: require('./letter.png'),
};
