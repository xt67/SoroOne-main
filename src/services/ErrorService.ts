import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Enhanced error types for better error handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  DATA_PROCESSING = 'DATA_PROCESSING',
  FILE_IMPORT = 'FILE_IMPORT',
  AI_SERVICE = 'AI_SERVICE',
  STORAGE = 'STORAGE',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Structured error interface for consistent error handling
 */
export interface AppError {
  id: string;
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: number;
  stack?: string;
  context?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userMessage: string;
  suggestions: string[];
}

/**
 * Error recovery strategies
 */
export interface ErrorRecovery {
  canRetry: boolean;
  retryAction?: () => Promise<void>;
  fallbackAction?: () => Promise<void>;
  userActions: Array<{
    label: string;
    action: () => Promise<void>;
  }>;
}

/**
 * Comprehensive error handling service
 */
class ErrorHandlingService {
  private errorLog: AppError[] = [];
  private readonly MAX_ERROR_LOG_SIZE = 100;
  private readonly ERROR_STORAGE_KEY = '@soroone_error_log';

  /**
   * Create a structured error from a raw error
   */
  createError(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>
  ): AppError {
    const baseError = typeof error === 'string' ? new Error(error) : error;
    
    return {
      id: this.generateErrorId(),
      type,
      message: baseError.message,
      details: this.getErrorDetails(baseError),
      timestamp: Date.now(),
      stack: baseError.stack,
      context,
      severity: this.determineSeverity(type, baseError),
      userMessage: this.generateUserMessage(type, baseError),
      suggestions: this.generateSuggestions(type, baseError)
    };
  }

  /**
   * Log an error with context
   */
  async logError(appError: AppError): Promise<void> {
    try {
      // Add to in-memory log
      this.errorLog.unshift(appError);
      
      // Keep log size manageable
      if (this.errorLog.length > this.MAX_ERROR_LOG_SIZE) {
        this.errorLog = this.errorLog.slice(0, this.MAX_ERROR_LOG_SIZE);
      }

      // Persist to storage
      await this.persistErrorLog();

      // Log to console for development
      if (__DEV__) {
        console.error('[ErrorService]', {
          type: appError.type,
          message: appError.message,
          context: appError.context,
          timestamp: new Date(appError.timestamp).toISOString()
        });
      }
    } catch (storageError) {
      console.error('Failed to log error:', storageError);
    }
  }

  /**
   * Handle an error with automatic logging and recovery
   */
  async handleError(
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>
  ): Promise<{ error: AppError; recovery: ErrorRecovery }> {
    const appError = this.createError(error, type, context);
    await this.logError(appError);
    
    const recovery = this.getErrorRecovery(appError);
    
    return { error: appError, recovery };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errorLog.slice(0, limit);
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: ErrorType): AppError[] {
    return this.errorLog.filter(error => error.type === type);
  }

  /**
   * Clear error log
   */
  async clearErrorLog(): Promise<void> {
    this.errorLog = [];
    await AsyncStorage.removeItem(this.ERROR_STORAGE_KEY);
  }

  /**
   * Load persisted errors
   */
  async loadPersistedErrors(): Promise<void> {
    try {
      const storedErrors = await AsyncStorage.getItem(this.ERROR_STORAGE_KEY);
      if (storedErrors) {
        this.errorLog = JSON.parse(storedErrors);
      }
    } catch (error) {
      console.error('Failed to load persisted errors:', error);
    }
  }

  /**
   * Generate error recovery options
   */
  private getErrorRecovery(error: AppError): ErrorRecovery {
    switch (error.type) {
      case ErrorType.NETWORK:
        return {
          canRetry: true,
          userActions: [
            {
              label: 'Check Connection',
              action: async () => {
                // Could implement network diagnostics
                console.log('Checking network connection...');
              }
            },
            {
              label: 'Retry',
              action: async () => {
                console.log('Retrying network operation...');
              }
            }
          ]
        };

      case ErrorType.FILE_IMPORT:
        return {
          canRetry: true,
          userActions: [
            {
              label: 'Try Different File',
              action: async () => {
                console.log('Opening file picker...');
              }
            },
            {
              label: 'Check File Format',
              action: async () => {
                console.log('Showing supported formats...');
              }
            }
          ]
        };

      case ErrorType.AI_SERVICE:
        return {
          canRetry: true,
          userActions: [
            {
              label: 'Check AI Service',
              action: async () => {
                console.log('Testing AI service connection...');
              }
            },
            {
              label: 'Use Without AI',
              action: async () => {
                console.log('Disabling AI features...');
              }
            }
          ]
        };

      default:
        return {
          canRetry: false,
          userActions: [
            {
              label: 'Report Issue',
              action: async () => {
                console.log('Opening issue reporter...');
              }
            }
          ]
        };
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get detailed error information
   */
  private getErrorDetails(error: Error): string {
    if (error.cause) {
      return `Caused by: ${error.cause}`;
    }
    return error.message;
  }

  /**
   * Determine error severity
   */
  private determineSeverity(type: ErrorType, error: Error): AppError['severity'] {
    if (type === ErrorType.STORAGE || type === ErrorType.DATA_PROCESSING) {
      return 'high';
    }
    if (type === ErrorType.NETWORK || type === ErrorType.AI_SERVICE) {
      return 'medium';
    }
    if (error.message.toLowerCase().includes('critical')) {
      return 'critical';
    }
    return 'low';
  }

  /**
   * Generate user-friendly error messages
   */
  private generateUserMessage(type: ErrorType, error: Error): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Unable to connect to the internet. Please check your connection.';
      case ErrorType.FILE_IMPORT:
        return 'There was a problem importing your file. Please check the file format.';
      case ErrorType.AI_SERVICE:
        return 'AI features are temporarily unavailable. You can still use other features.';
      case ErrorType.DATA_PROCESSING:
        return 'There was an issue processing your data. Please try again.';
      case ErrorType.STORAGE:
        return 'Unable to save your data. Please check available storage space.';
      case ErrorType.VALIDATION:
        return 'The data you entered is not valid. Please check and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Generate helpful suggestions
   */
  private generateSuggestions(type: ErrorType, error: Error): string[] {
    switch (type) {
      case ErrorType.NETWORK:
        return [
          'Check your internet connection',
          'Try switching to mobile data or WiFi',
          'Restart the app and try again'
        ];
      case ErrorType.FILE_IMPORT:
        return [
          'Ensure the file is in a supported format (Excel, CSV)',
          'Check if the file is corrupted',
          'Try with a smaller file first'
        ];
      case ErrorType.AI_SERVICE:
        return [
          'Make sure Ollama is running (web version)',
          'Check if the AI model is available',
          'Try using the app without AI features'
        ];
      default:
        return [
          'Restart the app',
          'Clear app cache',
          'Update to the latest version'
        ];
    }
  }

  /**
   * Persist error log to storage
   */
  private async persistErrorLog(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.ERROR_STORAGE_KEY,
        JSON.stringify(this.errorLog)
      );
    } catch (error) {
      console.error('Failed to persist error log:', error);
    }
  }
}

// Export singleton instance
export const errorService = new ErrorHandlingService();

// Helper functions for common error scenarios
export const handleNetworkError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.NETWORK, context);

export const handleFileImportError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.FILE_IMPORT, context);

export const handleAIServiceError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.AI_SERVICE, context);

export const handleDataProcessingError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.DATA_PROCESSING, context);

export const handleStorageError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.STORAGE, context);

export const handleValidationError = (error: Error, context?: Record<string, unknown>) =>
  errorService.handleError(error, ErrorType.VALIDATION, context);