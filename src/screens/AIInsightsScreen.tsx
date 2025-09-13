import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../styles/ThemeProvider';
import { dataService } from '../services/DataService';
import { ollamaService } from '../services/OllamaService';
import type { Dataset } from '../types';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestedQuestions = [
  "What patterns do you see in this data?",
  "What are the key insights from this dataset?",
  "Are there any correlations I should know about?",
  "What trends can you identify?",
];

export default function AIInsightsScreen() {
  const { theme } = useTheme();
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeAI();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCurrentDataset();
    }, [])
  );

  const initializeAI = async () => {
    try {
      console.log('Initializing AI service...');
      const ollamaAvailable = await ollamaService.isAvailable();
      setIsOllamaAvailable(ollamaAvailable);
      
      if (!ollamaAvailable) {
        // Don't show alert on mobile platforms - this is expected in tunnel mode
        if (Platform.OS === 'web') {
          Alert.alert(
            'AI Service Setup Required',
            'Ollama with Mistral model not accessible. Please ensure Ollama is running.',
            [
              { text: 'OK', style: 'cancel' },
              { text: 'Retry', onPress: initializeAI }
            ]
          );
        } else {
          console.log('💡 AI features require web version or development build when using Expo tunnel');
        }
      }

      await loadCurrentDataset();
    } catch (error) {
      console.error('Failed to initialize AI:', error);
      setIsOllamaAvailable(false);
      await loadCurrentDataset();
    }
  };

  const loadCurrentDataset = async () => {
    try {
      await dataService.initialize();
      const datasets = await dataService.getDatasets();
      console.log('AIInsightsScreen: Loaded datasets:', datasets.length);
      if (datasets.length > 0) {
        const latestDataset = datasets[datasets.length - 1];
        setCurrentDataset(latestDataset);
        console.log('AIInsightsScreen: Set current dataset with', latestDataset.data?.length || 0, 'rows');
      } else {
        console.log('AIInsightsScreen: No datasets found');
        setCurrentDataset(null);
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
      setCurrentDataset(null);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: question.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsGenerating(true);

    try {
      let response = '';

      if (isOllamaAvailable && currentDataset) {
        const dataRows = currentDataset.data;
        const columns = Object.keys(dataRows[0] || {});
        
        const prompt = `You are a data analyst AI. Analyze this dataset and answer the user's question.

Dataset: "${currentDataset.name}"
Columns: ${columns.join(', ')}
Total rows: ${dataRows.length}

User question: "${userMessage.content}"

Please provide a clear, insightful analysis based on the actual data.`;

        response = await ollamaService.generateResponse(prompt);
      } else {
        response = `I'd be happy to analyze your data, but I need the AI service to be properly connected to provide detailed insights.

For now, I can tell you that your dataset "${currentDataset?.name || 'your data'}" has been loaded successfully.`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while analyzing your data. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuestion(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={[
          styles.messageContent,
          message.isUser
            ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
            : [styles.aiBubble, { backgroundColor: theme.colors.surface }]
        ]}>
          <Text style={[
            styles.messageText,
            { color: message.isUser ? '#FFFFFF' : theme.colors.textPrimary }
          ]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name="analytics-outline" size={32} color={theme.colors.primary} />
        </View>
        <Text style={[styles.welcomeTitle, { color: theme.colors.textPrimary }]}>
          Chat with your data
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
          {!isOllamaAvailable && (Platform.OS === 'android' || Platform.OS === 'ios') 
            ? `Dataset: ${currentDataset?.name || 'No dataset'} • AI features require web version when using Expo tunnel`
            : currentDataset 
            ? `Ask questions about your "${currentDataset.name}" dataset using AI`
            : 'Upload a dataset to get started with AI insights'
          }
        </Text>

        {currentDataset && isOllamaAvailable && (
          <View style={styles.suggestionsContainer}>
            {suggestedQuestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionChip, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: theme.colors.textPrimary }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentDataset && !isOllamaAvailable && (Platform.OS === 'android' || Platform.OS === 'ios') && (
          <View style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              AI chat is not available in mobile Expo tunnel mode. Use the web version for full AI features.
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? renderEmptyState() : messages.map(renderMessage)}

          {isGenerating && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageContent, styles.aiBubble, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                    AI is thinking...
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.textPrimary }]}
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask anything about your data..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={500}
              onSubmitEditing={handleAskQuestion}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: question.trim() ? theme.colors.primary : theme.colors.textSecondary + '30',
                  opacity: isGenerating ? 0.5 : 1
                }
              ]}
              onPress={handleAskQuestion}
              disabled={isGenerating || !question.trim()}
            >
              <Ionicons
                name="send"
                size={18}
                color={question.trim() ? '#FFFFFF' : theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusIndicator}>
              <View style={[
                styles.statusDot,
                { backgroundColor: isOllamaAvailable ? '#10B981' : '#F59E0B' }
              ]} />
              <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
                {isOllamaAvailable ? 'AI Connected' : 'Basic Mode'}
              </Text>
            </View>

            {currentDataset ? (
              <Text style={[styles.datasetInfo, { color: theme.colors.textSecondary }]}>
                {currentDataset.data?.length || 0} rows loaded
              </Text>
            ) : (
              <Text style={[styles.datasetInfo, { color: theme.colors.textSecondary }]}>
                No dataset loaded
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4, // Reduced from 8
    justifyContent: 'center', // Center content when empty
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20, // Reduced from 60 to 20
  },
  logoContainer: {
    width: 60, // Reduced from 80
    height: 60, // Reduced from 80
    borderRadius: 30, // Reduced from 40
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Reduced from 24
  },
  welcomeTitle: {
    fontSize: 24, // Reduced from 28
    fontWeight: '600',
    marginBottom: 6, // Reduced from 8
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14, // Reduced from 16
    textAlign: 'center',
    lineHeight: 20, // Reduced from 22
    marginBottom: 24, // Reduced from 32
  },
  suggestionsContainer: {
    width: '100%',
    gap: 8, // Reduced from 12
  },
  suggestionChip: {
    paddingHorizontal: 12, // Reduced from 20
    paddingVertical: 8, // Reduced from 14
    borderRadius: 16, // Reduced from 25
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 13, // Reduced from 15
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8, // Reduced from 12
    paddingBottom: 8, // Reduced from 16
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10, // Reduced from 12
    minHeight: 46, // Reduced from 50
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6, // Reduced from 8
    paddingHorizontal: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  datasetInfo: {
    fontSize: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});
