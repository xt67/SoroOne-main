import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeStyles = {
    small: { iconSize: 24, fontSize: 16 },
    medium: { iconSize: 32, fontSize: 20 },
    large: { iconSize: 48, fontSize: 28 },
  };

  const { iconSize, fontSize } = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: iconSize + 16, height: iconSize + 16 }]}>
        <Ionicons name="analytics" size={iconSize} color="#FFFFFF" />
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize }]}>
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
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
