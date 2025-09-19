module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['.'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@store': './src/app/store',
          '@services': './src/services',
          '@viewmodels': './src/viewmodels',
          '@hooks': './src/shared/domain/hooks',
          '@types': './src/types',
          '@navigation': './src/app/navigation',
          '@validators': './src/validators',
          '@config': './src/app/config',
          '@assets': './src/assets',
          '@shared': './src/shared',
          '@theme': './src/shared/presentation/theme',
          '@features': './src/features',
          '@app': './src/app',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
