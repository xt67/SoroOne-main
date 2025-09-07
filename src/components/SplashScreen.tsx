import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Logo } from './Logo';
import { useTheme } from '../styles/ThemeProvider';

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide splash screen after animation
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationEnd();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Logo size="large" showText={true} />
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Transform your data into insights
        </Text>
        <View style={styles.loadingIndicator}>
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.loadingDot, { backgroundColor: theme.colors.primary }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 40,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
});
