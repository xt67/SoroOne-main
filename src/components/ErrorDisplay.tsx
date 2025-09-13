import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../styles/useTheme';
import { AppError, ErrorRecovery } from '../services/ErrorService';

interface ErrorDisplayProps {
  error: AppError;
  recovery?: ErrorRecovery;
  onDismiss?: () => void;
  showDetails?: boolean;
}

/**
 * Component to display errors in a user-friendly way
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  recovery,
  onDismiss,
  showDetails = false,
}) => {
  const { theme } = useTheme();

  const getSeverityColor = (severity: AppError['severity']) => {
    switch (severity) {
      case 'critical':
        return '#FF4444';
      case 'high':
        return '#FF8800';
      case 'medium':
        return '#FFAA00';
      case 'low':
        return '#4CAF50';
      default:
        return theme.colors.error;
    }
  };

  const getSeverityIcon = (severity: AppError['severity']) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '❗';
    }
  };

  const handleUserAction = async (action: () => Promise<void>, label: string) => {
    try {
      await action();
      if (onDismiss) {
        onDismiss();
      }
    } catch (actionError) {
      Alert.alert(
        'Action Failed',
        `Failed to execute "${label}". Please try again.`
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {/* Error Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>
          {getSeverityIcon(error.severity)}
        </Text>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {error.userMessage}
          </Text>
          <Text style={[styles.severity, { color: getSeverityColor(error.severity) }]}>
            {error.severity.toUpperCase()} • {error.type}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={[styles.dismissText, { color: theme.colors.textSecondary }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions */}
      {error.suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <Text style={[styles.suggestionsTitle, { color: theme.colors.textSecondary }]}>
            Try these solutions:
          </Text>
          {error.suggestions.map((suggestion, index) => (
            <Text
              key={index}
              style={[styles.suggestion, { color: theme.colors.textSecondary }]}
            >
              • {suggestion}
            </Text>
          ))}
        </View>
      )}

      {/* Recovery Actions */}
      {recovery && recovery.userActions.length > 0 && (
        <View style={styles.actions}>
          {recovery.userActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                index === 0 ? { backgroundColor: theme.colors.primary } : styles.secondaryButton,
                { borderColor: theme.colors.border }
              ]}
              onPress={() => handleUserAction(action.action, action.label)}
            >
              <Text
                style={[
                  styles.actionText,
                  index === 0
                    ? { color: theme.colors.background }
                    : { color: theme.colors.primary }
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Error Details (Development) */}
      {showDetails && __DEV__ && (
        <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
          <Text style={[styles.detailsTitle, { color: theme.colors.textSecondary }]}>
            Technical Details (Dev Mode):
          </Text>
          <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
            ID: {error.id}
          </Text>
          <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
            Time: {new Date(error.timestamp).toLocaleString()}
          </Text>
          <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
            Message: {error.message}
          </Text>
          {error.details && (
            <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
              Details: {error.details}
            </Text>
          )}
          {error.context && (
            <Text style={[styles.detailsText, { color: theme.colors.textSecondary }]}>
              Context: {JSON.stringify(error.context, null, 2)}
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

/**
 * Compact error display for inline usage
 */
export const ErrorDisplayCompact: React.FC<{
  error: AppError;
  onRetry?: () => void;
}> = ({ error, onRetry }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.compactContainer, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.compactText, { color: theme.colors.textSecondary }]}>
        {error.userMessage}
      </Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={[styles.retryText, { color: theme.colors.primary }]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },
  severity: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestions: {
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  details: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    maxHeight: 200,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
    marginBottom: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    margin: 8,
    borderRadius: 8,
  },
  compactText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorDisplay;