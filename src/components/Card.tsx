import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../styles/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}) => {
  const { theme } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
    },
    getVariantStyles(variant, theme),
    getPaddingStyles(padding, theme),
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const getVariantStyles = (variant: string, theme: any) => {
  switch (variant) {
    case 'elevated':
      return {
        ...theme.shadows.md,
        borderRadius: theme.borderRadius.lg,
      };
    case 'outlined':
      return {
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        borderRadius: theme.borderRadius.lg,
      };
    default:
      return {
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
      };
  }
};

const getPaddingStyles = (padding: string, theme: any) => {
  switch (padding) {
    case 'none':
      return {};
    case 'small':
      return { padding: theme.spacing.sm };
    case 'large':
      return { padding: theme.spacing.xl };
    default: // medium
      return { padding: theme.spacing.lg };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
  },
});
