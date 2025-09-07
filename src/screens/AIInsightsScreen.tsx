import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

interface InsightCard {
  id: string;
  title: string;
  content: string;
  type: 'trend' | 'correlation' | 'anomaly' | 'prediction';
  confidence: number;
}

export default function AIInsightsScreen() {
  const { theme } = useTheme();
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<InsightCard[]>([]);

  useEffect(() => {
    generateSampleInsights();
  }, []);

  const generateSampleInsights = () => {
    const sampleInsights: InsightCard[] = [
      {
        id: '1',
        title: 'Sales Trend Analysis',
        content: 'Your sales data shows a 15% increase over the last quarter. The upward trend is particularly strong in the technology and healthcare sectors.',
        type: 'trend',
        confidence: 92,
      },
      {
        id: '2',
        title: 'Customer Correlation',
        content: 'There\'s a strong correlation (0.87) between customer satisfaction scores and repeat purchase rates. Focus on improving satisfaction to boost retention.',
        type: 'correlation',
        confidence: 87,
      },
      {
        id: '3',
        title: 'Anomaly Detection',
        content: 'Unusual spike in returns detected for Product Category X during March. Consider investigating quality issues or seasonal factors.',
        type: 'anomaly',
        confidence: 78,
      },
      {
        id: '4',
        title: 'Revenue Prediction',
        content: 'Based on current trends, projected Q4 revenue is $1.2M ± $150K. Confidence interval: 95%. Key drivers: seasonal patterns and marketing campaigns.',
        type: 'prediction',
        confidence: 85,
      },
    ];
    setInsights(sampleInsights);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question about your data.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const newInsight: InsightCard = {
        id: Date.now().toString(),
        title: 'Custom Analysis',
        content: `Based on your question "${question}", here's what I found: This appears to be related to your data patterns. The analysis suggests looking into historical trends and comparing with industry benchmarks for better insights.`,
        type: 'correlation',
        confidence: Math.floor(Math.random() * 20) + 75,
      };
      
      setInsights(prev => [newInsight, ...prev]);
      setQuestion('');
      setIsGenerating(false);
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return 'trending-up-outline';
      case 'correlation': return 'git-network-outline';
      case 'anomaly': return 'warning-outline';
      case 'prediction': return 'telescope-outline';
      default: return 'bulb-outline';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return '#10B981';
      case 'correlation': return '#2563EB';
      case 'anomaly': return '#F59E0B';
      case 'prediction': return '#8B5CF6';
      default: return theme.colors.primary;
    }
  };

  const suggestedQuestions = [
    "What are the main trends in my data?",
    "Which columns have the most missing values?",
    "Show me correlations between variables",
    "What are the outliers in my dataset?",
    "Generate a summary report",
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI-Powered Insights</Text>
        <Text style={styles.subtitle}>
          Ask questions about your data in natural language
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.questionInput}
          value={question}
          onChangeText={setQuestion}
          placeholder="What would you like to know about your data?"
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity 
          style={[styles.askButton, isGenerating && styles.askButtonDisabled]}
          onPress={handleAskQuestion}
          disabled={isGenerating}
        >
          <Ionicons 
            name={isGenerating ? "hourglass-outline" : "send-outline"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.askButtonText}>
            {isGenerating ? 'Analyzing...' : 'Ask AI'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.sectionTitle}>Suggested Questions</Text>
        <View style={styles.suggestionsGrid}>
          {suggestedQuestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={() => setQuestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.insightsContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Generated Insights
        </Text>
        {isGenerating && (
          <View style={[styles.loadingCard, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Generating insights...
            </Text>
          </View>
        )}
        {insights.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="bulb-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No insights yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Start by asking a question about your data
            </Text>
          </View>
        ) : (
          <View>
            {insights.map((insight) => (
              <View 
                key={insight.id} 
                style={[styles.insightCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.insightHeader}>
                  <View style={styles.insightTitleRow}>
                    <Ionicons 
                      name={getInsightIcon(insight.type)} 
                      size={24} 
                      color={getInsightColor(insight.type)} 
                    />
                    <Text style={[styles.insightTitle, { color: theme.colors.textPrimary }]}>
                      {insight.title}
                    </Text>
                  </View>
                  <View style={styles.confidenceContainer}>
                    <Text style={[styles.confidenceText, { color: theme.colors.textSecondary }]}>
                      {insight.confidence}% confidence
                    </Text>
                  </View>
                </View>
                <Text style={[styles.insightContent, { color: theme.colors.textSecondary }]}>
                  {insight.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>AI Features</Text>
        
        <View style={styles.featureCard}>
          <Ionicons name="analytics-outline" size={32} color="#2563EB" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Data Analysis</Text>
            <Text style={styles.featureDescription}>
              Get statistical insights and pattern recognition
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="trending-up-outline" size={32} color="#10B981" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Trend Detection</Text>
            <Text style={styles.featureDescription}>
              Identify trends and forecasting opportunities
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="alert-circle-outline" size={32} color="#F59E0B" />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Anomaly Detection</Text>
            <Text style={styles.featureDescription}>
              Discover outliers and unusual patterns
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  askButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  suggestionsGrid: {
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  insightsContainer: {
    padding: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  insightCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  confidenceContainer: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  featuresContainer: {
    padding: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});
