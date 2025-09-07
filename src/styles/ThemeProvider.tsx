import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeMode, Theme, ColorScheme, createThemeWithColorScheme } from './theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('blue');

  useEffect(() => {
    // Load saved theme preference
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const [savedTheme, savedColorScheme] = await Promise.all([
        AsyncStorage.getItem('theme_mode'),
        AsyncStorage.getItem('color_scheme'),
      ]);
      
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
      
      if (savedColorScheme && ['blue', 'purple', 'green', 'orange', 'teal', 'pink'].includes(savedColorScheme)) {
        setColorSchemeState(savedColorScheme as ColorScheme);
      }
    } catch (error) {
      console.error('Failed to load theme preferences:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      setColorSchemeState(scheme);
      await AsyncStorage.setItem('color_scheme', scheme);
    } catch (error) {
      console.error('Failed to save color scheme preference:', error);
    }
  };

  const getActiveTheme = (): Theme => {
    const baseTheme = (() => {
      if (themeMode === 'auto') {
        return systemColorScheme === 'dark' ? darkTheme : lightTheme;
      }
      return themeMode === 'dark' ? darkTheme : lightTheme;
    })();

    return createThemeWithColorScheme(baseTheme, colorScheme);
  };

  const isDark = (): boolean => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  };

  const value: ThemeContextType = {
    theme: getActiveTheme(),
    themeMode,
    colorScheme,
    isDark: isDark(),
    setThemeMode,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
