// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
  DocumentPickerResult: {}
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  documentDirectory: 'file://test/',
  EncodingType: {
    UTF8: 'utf8'
  }
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn()
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn()
  }),
  useRoute: () => ({
    params: {}
  }),
  useFocusEffect: jest.fn()
}));

// Mock React Native elements
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
  ProgressChart: 'ProgressChart',
  ContributionGraph: 'ContributionGraph',
  StackedBarChart: 'StackedBarChart'
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock console to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};
