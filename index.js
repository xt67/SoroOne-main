/**
 * Polyfill for TurboModuleRegistry issues in Expo SDK 53
 * This resolves PlatformConstants module not found errors
 */

// Early polyfill before other imports
import './polyfills';

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
