/**
 * Theme and styling configuration for Dashly
 */

export const lightTheme = {
  colors: {
    primary: '#2563EB',
    secondary: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
    accent: '#8B5CF6',
    chart: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#34D399',
    background: '#111827',
    surface: '#1F2937',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textDisabled: '#6B7280',
    border: '#374151',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    info: '#60A5FA',
    accent: '#A78BFA',
    chart: ['#3B82F6', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#22D3EE'],
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    mono: 'JetBrainsMono_400Regular',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const dimensions = {
  headerHeight: 64,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 120,
  chartMinHeight: 200,
  modalMaxWidth: 400,
};

export const animations = {
  duration: {
    short: 150,
    medium: 300,
    long: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark' | 'auto';

// Color Schemes - Different color palettes for customization
export const colorSchemes = {
  blue: {
    name: 'Ocean Blue',
    light: {
      primary: '#2563EB',
      secondary: '#10B981',
      accent: '#8B5CF6',
      chart: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    },
    dark: {
      primary: '#3B82F6',
      secondary: '#34D399',
      accent: '#A78BFA',
      chart: ['#3B82F6', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#22D3EE'],
    },
  },
  purple: {
    name: 'Royal Purple',
    light: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      chart: ['#7C3AED', '#EC4899', '#F59E0B', '#EF4444', '#10B981', '#06B6D4'],
    },
    dark: {
      primary: '#8B5CF6',
      secondary: '#F472B6',
      accent: '#FBBF24',
      chart: ['#8B5CF6', '#F472B6', '#FBBF24', '#F87171', '#34D399', '#22D3EE'],
    },
  },
  green: {
    name: 'Forest Green',
    light: {
      primary: '#059669',
      secondary: '#7C3AED',
      accent: '#DC2626',
      chart: ['#059669', '#7C3AED', '#F59E0B', '#DC2626', '#2563EB', '#06B6D4'],
    },
    dark: {
      primary: '#10B981',
      secondary: '#8B5CF6',
      accent: '#EF4444',
      chart: ['#10B981', '#8B5CF6', '#FBBF24', '#EF4444', '#3B82F6', '#22D3EE'],
    },
  },
  orange: {
    name: 'Sunset Orange',
    light: {
      primary: '#EA580C',
      secondary: '#DC2626',
      accent: '#7C3AED',
      chart: ['#EA580C', '#DC2626', '#7C3AED', '#059669', '#2563EB', '#06B6D4'],
    },
    dark: {
      primary: '#FB923C',
      secondary: '#EF4444',
      accent: '#8B5CF6',
      chart: ['#FB923C', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6', '#22D3EE'],
    },
  },
  teal: {
    name: 'Ocean Teal',
    light: {
      primary: '#0891B2',
      secondary: '#059669',
      accent: '#DC2626',
      chart: ['#0891B2', '#059669', '#F59E0B', '#DC2626', '#7C3AED', '#2563EB'],
    },
    dark: {
      primary: '#06B6D4',
      secondary: '#10B981',
      accent: '#EF4444',
      chart: ['#06B6D4', '#10B981', '#FBBF24', '#EF4444', '#8B5CF6', '#3B82F6'],
    },
  },
  pink: {
    name: 'Rose Pink',
    light: {
      primary: '#E11D48',
      secondary: '#7C3AED',
      accent: '#059669',
      chart: ['#E11D48', '#7C3AED', '#F59E0B', '#059669', '#2563EB', '#06B6D4'],
    },
    dark: {
      primary: '#F43F5E',
      secondary: '#8B5CF6',
      accent: '#10B981',
      chart: ['#F43F5E', '#8B5CF6', '#FBBF24', '#10B981', '#3B82F6', '#22D3EE'],
    },
  },
};

export type ColorScheme = keyof typeof colorSchemes;

// Function to create theme with specific color scheme
export const createThemeWithColorScheme = (baseTheme: typeof lightTheme, colorScheme: ColorScheme) => {
  const isDark = baseTheme === darkTheme;
  const schemeColors = colorSchemes[colorScheme][isDark ? 'dark' : 'light'];
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...schemeColors,
    },
  };
};
