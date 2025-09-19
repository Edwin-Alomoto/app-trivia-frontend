const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configurar aliases para Metro
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@store': path.resolve(__dirname, 'src/app/store'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@viewmodels': path.resolve(__dirname, 'src/viewmodels'),
  '@hooks': path.resolve(__dirname, 'src/shared/domain/hooks'),
  '@types': path.resolve(__dirname, 'src/types'),
  '@navigation': path.resolve(__dirname, 'src/app/navigation'),
  '@validators': path.resolve(__dirname, 'src/validators'),
  '@config': path.resolve(__dirname, 'src/app/config'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@shared': path.resolve(__dirname, 'src/shared'),
  '@theme': path.resolve(__dirname, 'src/shared/presentation/theme'),
  '@features': path.resolve(__dirname, 'src/features'),
  '@app': path.resolve(__dirname, 'src/app'),
};

// Configurar assets para Metro
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'
];

module.exports = config;
