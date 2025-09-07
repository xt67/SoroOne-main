import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Question Input */}
          <Card style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>Ask AI About Your Data</Text>
              <TextInput
                style={[styles.questionInput, { 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }]}
                value={question}
                onChangeText={setQuestion}
                placeholder="What would you like to know about your data?"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
              <Button
                title={isGenerating ? 'Analyzing...' : 'Ask AI'}
                onPress={handleAskQuestion}
                disabled={isGenerating}
                style={styles.askButton}
              />
            </View>
          </Card>

          {/* Suggested Questions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Suggested Questions</Text>
            <View style={styles.suggestionsGrid}>
              {suggestedQuestions.map((suggestion, index) => (
                <Card key={index} style={styles.suggestionCard}>
                  <TouchableOpacity
                    style={styles.suggestionContent}
                    onPress={() => setQuestion(suggestion)}
                  >
                    <Text style={[styles.suggestionText, { color: theme.colors.textPrimary }]}>{suggestion}</Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          </View>

          {/* Generated Insights */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Generated Insights
            </Text>
            
            {isGenerating && (
              <Card style={styles.loadingCard}>
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                    Generating insights...
                  </Text>
                </View>
              </Card>
            )}
            
            {insights.length === 0 && !isGenerating ? (
              <Card style={styles.emptyCard}>
                <View style={styles.emptyState}>
                  <Ionicons name="bulb-outline" size={48} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                    No insights yet
                  </Text>
                  <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                    Start by asking a question about your data or choose from suggested questions above
                  </Text>
                </View>
              </Card>
            ) : (
              <View style={styles.insightsList}>
                {insights.map((insight) => (
                  <Card key={insight.id} style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                      <View style={styles.insightTitleRow}>
                        <View style={[styles.insightIcon, { backgroundColor: `${getInsightColor(insight.type)}20` }]}>
                          <Ionicons 
                            name={getInsightIcon(insight.type)} 
                            size={20} 
                            color={getInsightColor(insight.type)} 
                          />
                        </View>
                        <View style={styles.insightTitleContainer}>
                          <Text style={[styles.insightTitle, { color: theme.colors.textPrimary }]}>
                            {insight.title}
                          </Text>
                          <Text style={[styles.confidenceText, { color: theme.colors.textSecondary }]}>
                            {insight.confidence}% confidence
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.insightContent, { color: theme.colors.textSecondary }]}>
                      {insight.content}
                    </Text>
                  </Card>
                ))}
              </View>
            )}
          </View>

          {/* AI Features */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>AI Features</Text>
            <View style={styles.featuresGrid}>
              <Card style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <View style={[styles.featureIcon, { backgroundColor: '#2563EB20' }]}>
                    <Ionicons name="analytics-outline" size={24} color="#2563EB" />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>Data Analysis</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Statistical insights and patterns
                  </Text>
                </View>
              </Card>

              <Card style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <View style={[styles.featureIcon, { backgroundColor: '#10B98120' }]}>
                    <Ionicons name="trending-up-outline" size={24} color="#10B981" />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>Trend Detection</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Identify trends and forecasts
                  </Text>
                </View>
              </Card>

              <Card style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <View style={[styles.featureIcon, { backgroundColor: '#F59E0B20' }]}>
                    <Ionicons name="alert-circle-outline" size={24} color="#F59E0B" />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.textPrimary }]}>Anomaly Detection</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Discover outliers and patterns
                  </Text>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputCard: {
    marginBottom: 24,
  },
  inputContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  askButton: {
    marginTop: 0,
  },
  suggestionsGrid: {
    gap: 12,
  },
  suggestionCard: {
    marginBottom: 0,
  },
  suggestionContent: {
    padding: 16,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingCard: {
    marginBottom: 16,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyCard: {
    padding: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsList: {
    gap: 12,
  },
  insightCard: {
    marginBottom: 0,
  },
  insightHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  insightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightContent: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    marginBottom: 0,
  },
  featureContent: {
    alignItems: 'center',
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
