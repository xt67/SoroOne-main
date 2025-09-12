/**
 * Polyfills for React Native / Expo compatibility
 */

// Only add polyfills if actually needed
if (typeof global !== 'undefined' && !global.__turboModuleProxy) {
  // Minimal TurboModule polyfill - only if missing
  try {
    global.__turboModuleProxy = function(name) {
      return null; // Let React Native handle modules normally
    };
  } catch (e) {
    // Ignore polyfill errors on mobile
  }
}
