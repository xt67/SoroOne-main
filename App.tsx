import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/styles/ThemeProvider';
import { SplashScreen } from './src/components/SplashScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { errorService } from './src/services/ErrorService';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize error service
    errorService.loadPersistedErrors();
  }, []);

  const handleSplashEnd = () => {
    setIsLoading(false);
  };

  const handleAppError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log critical app errors
    errorService.handleError(error, 'UNKNOWN' as any, {
      errorInfo,
      location: 'App.tsx',
      timestamp: Date.now(),
    });
  };

  return (
    <ErrorBoundary onError={handleAppError}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          {isLoading ? (
            <SplashScreen onAnimationEnd={handleSplashEnd} />
          ) : (
            <AppNavigator />
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
