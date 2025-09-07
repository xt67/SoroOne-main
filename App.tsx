import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/styles/ThemeProvider';
import { SplashScreen } from './src/components/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashEnd = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      {isLoading ? (
        <SplashScreen onAnimationEnd={handleSplashEnd} />
      ) : (
        <AppNavigator />
      )}
    </ThemeProvider>
  );
}
