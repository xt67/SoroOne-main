const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolver configurations to handle TurboModuleRegistry issues
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable hermès for better performance and stability
config.transformer.hermesParser = true;

// Add resolvers for problematic modules
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-platform-constants': 'expo-constants',
};

module.exports = config;
