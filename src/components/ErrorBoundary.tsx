import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../styles/useTheme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides user-friendly error messages and recovery options
 */
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component with theme support
 */
function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          🚨 Something went wrong
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          An unexpected error occurred. Please try again.
        </Text>

        {error && __DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error.name}: {error.message}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={onReset}
        >
          <Text style={[styles.buttonText, { color: theme.colors.background }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Hook-based Error Boundary wrapper for functional components
 */
export function ErrorBoundary({ children, fallback, onError }: Props) {
  return (
    <ErrorBoundaryClass fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryClass>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorDetails: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ErrorBoundary;