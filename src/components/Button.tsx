import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  
  const buttonStyles = [
    styles.button,
    getVariantStyles(variant, theme),
    getSizeStyles(size),
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    getTextVariantStyles(variant, theme),
    getTextSizeStyles(size),
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconColor = getIconColor(variant, theme);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={iconColor}
          style={{ marginRight: title ? 8 : 0 }} 
        />
      ) : (
        icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={iconSize} 
            color={iconColor}
            style={{ marginRight: 8 }} 
          />
        )
      )}
      
      {title && <Text style={textStyles}>{title}</Text>}
      
      {!loading && icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={iconSize} 
          color={iconColor}
          style={{ marginLeft: 8 }} 
        />
      )}
    </TouchableOpacity>
  );
};

const getVariantStyles = (variant: string, theme: any) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.sm,
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.secondary,
        ...theme.shadows.sm,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
    default:
      return {};
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
      };
    case 'large':
      return {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 14,
      };
    default: // medium
      return {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
      };
  }
};

const getTextVariantStyles = (variant: string, theme: any) => {
  switch (variant) {
    case 'primary':
    case 'secondary':
      return { color: '#FFFFFF' };
    case 'outline':
    case 'ghost':
      return { color: theme.colors.primary };
    default:
      return {};
  }
};

const getTextSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return {
        fontSize: 14,
        fontWeight: '600' as const,
      };
    case 'large':
      return {
        fontSize: 18,
        fontWeight: '600' as const,
      };
    default: // medium
      return {
        fontSize: 16,
        fontWeight: '600' as const,
      };
  }
};

const getIconColor = (variant: string, theme: any) => {
  switch (variant) {
    case 'primary':
    case 'secondary':
      return '#FFFFFF';
    case 'outline':
    case 'ghost':
      return theme.colors.primary;
    default:
      return theme.colors.primary;
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
