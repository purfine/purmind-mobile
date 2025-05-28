module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporariamente removido para debug
      // 'react-native-reanimated/plugin',
    ],
  };
};
