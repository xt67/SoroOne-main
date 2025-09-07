/**
 * Polyfills for React Native / Expo compatibility
 */

// Polyfill for TurboModuleRegistry PlatformConstants issue
if (typeof global !== 'undefined') {
  // Add polyfill for missing modules
  global.__turboModuleProxy = global.__turboModuleProxy || function(name) {
    if (name === 'PlatformConstants') {
      // Return a basic platform constants object
      return {
        osVersion: '',
        model: '',
        brand: '',
        manufacturer: '',
      };
    }
    return null;
  };
}

// Console polyfill for better debugging
if (typeof console === 'undefined') {
  global.console = {
    log: () => {},
    warn: () => {},
    error: () => {},
    info: () => {},
    debug: () => {},
  };
}
