import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeStyles = {
    small: { iconSize: 24, fontSize: 16, containerSize: 40 },
    medium: { iconSize: 32, fontSize: 20, containerSize: 48 },
    large: { iconSize: 48, fontSize: 28, containerSize: 64 },
  };

  const { iconSize, fontSize, containerSize } = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={[
        styles.logoContainer, 
        { 
          width: containerSize, 
          height: containerSize,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderWidth: 2,
        }
      ]}>
        <Ionicons name="bar-chart" size={iconSize} color="#1F2937" />
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize, color: '#1F2937' }]}>
          SoroOne
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
