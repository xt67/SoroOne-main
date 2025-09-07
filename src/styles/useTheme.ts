import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeMode } from './theme';

export const useTheme = (themeMode: ThemeMode = 'auto') => {
  const systemColorScheme = useColorScheme();
  
  const getActiveTheme = () => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const isDark = () => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  };

  return {
    theme: getActiveTheme(),
    isDark: isDark(),
    themeMode,
  };
};
