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
          '@store': './src/store',
          '@services': './src/services',
          '@viewmodels': './src/viewmodels',
          '@hooks': './src/hooks',
          '@types': './src/types',
          '@navigation': './src/navigation',
          '@validators': './src/validators',
          '@config': './src/config',
          '@assets': './assets',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
