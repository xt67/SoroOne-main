/**
 * Ollama service for AI insights using local Mistral model
 */

import { Platform } from 'react-native';
import { getOllamaConfig } from './NetworkConfig';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

class OllamaService {
  private baseUrl = 'http://localhost:11434';
  private config = getOllamaConfig();

  /**
   * Check if we can use Ollama (disable on mobile for testing)
   */
  private canUseOllama(): boolean {
    return Platform.OS === 'web';
  }

  /**
   * Check if Ollama server is running and model is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.canUseOllama()) {
      console.log('Ollama disabled on mobile platform');
      return false;
    }

    try {
      console.log('Checking Ollama availability...');
      
      for (const url of this.config.baseUrls) {
        try {
          console.log(`Trying ${url}/api/tags`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(`${url}/api/tags`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            const hasModel = data.models?.some((model: any) => 
              model.name.includes(this.config.model) || model.name.includes('mistral')
            );
            
            if (hasModel) {
              console.log(`Ollama found at ${url} with ${this.config.model} model`);
              this.baseUrl = url; // Update base URL to working one
              return true;
            } else {
              console.log(`Ollama found at ${url} but no ${this.config.model} model available`);
              console.log('Available models:', data.models?.map((m: any) => m.name).join(', '));
            }
          }
        } catch (urlError) {
          console.log(`Failed to connect to ${url}:`, urlError instanceof Error ? urlError.message : 'Unknown error');
          continue;
        }
      }
      
      console.log('Ollama not available on any configured URL');
      return false;
    } catch (error) {
      console.warn('Ollama availability check failed:', error);
      return false;
    }
  }

  /**
   * Generate AI response using Mistral model
   */
  async generateResponse(prompt: string, options?: {
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    if (!this.canUseOllama()) {
      return 'AI insights are not available on mobile devices. Please use the web version for AI-powered features.';
    }

    try {
      console.log('Generating AI response with Ollama...');
      
      const requestBody: OllamaRequest = {
        model: this.config.model,
        prompt,
        stream: false,
        options: {
          temperature: options?.temperature || 0.7,
          max_tokens: options?.max_tokens || 500,
        }
      };

      console.log(`Making request to: ${this.baseUrl}/api/generate`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for generation

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      console.log('AI response generated successfully');
      return data.response;
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('AI request timed out. Please try again.');
      }
      throw new Error('AI service temporarily unavailable. Please check if Ollama is running and accessible.');
    }
  }

  /**
   * Generate dataset insights using Mistral
   */
  async generateDatasetInsights(dataset: {
    name: string;
    rowCount: number;
    columns: Array<{ name: string; type: string; }>;
    sampleData: Record<string, any>[];
  }): Promise<Array<{
    id: string;
    title: string;
    content: string;
    type: 'trend' | 'correlation' | 'anomaly' | 'prediction';
    confidence: number;
  }>> {
    const prompt = `Analyze this dataset and provide 3-4 key insights:

Dataset: ${dataset.name}
Rows: ${dataset.rowCount}
Columns: ${dataset.columns.map(col => `${col.name} (${col.type})`).join(', ')}

Sample data (first 5 rows):
${JSON.stringify(dataset.sampleData.slice(0, 5), null, 2)}

Please provide insights in this exact JSON format:
[
  {
    "title": "Insight title",
    "content": "Detailed insight description with specific data points",
    "type": "trend|correlation|anomaly|prediction",
    "confidence": 85
  }
]

Focus on:
1. Data quality and completeness
2. Statistical patterns and trends
3. Potential correlations between variables
4. Anomalies or outliers
5. Business implications

Respond only with valid JSON array.`;

    try {
      const response = await this.generateResponse(prompt, { temperature: 0.3 });
      
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const insights = JSON.parse(jsonMatch[0]);
      
      // Add unique IDs and ensure proper structure
      return insights.map((insight: any, index: number) => ({
        id: `ai_insight_${Date.now()}_${index}`,
        title: insight.title || `Insight ${index + 1}`,
        content: insight.content || 'Analysis completed',
        type: insight.type || 'trend',
        confidence: Math.min(Math.max(insight.confidence || 75, 0), 100)
      }));
    } catch (error) {
      console.error('Failed to parse AI insights:', error);
      // Fallback to basic analysis
      return this.generateBasicInsights(dataset);
    }
  }

  /**
   * Answer specific questions about the dataset
   */
  async answerDatasetQuestion(question: string, dataset: {
    name: string;
    rowCount: number;
    columns: Array<{ name: string; type: string; }>;
    sampleData: Record<string, any>[];
  }): Promise<string> {
    const prompt = `You are a data analyst. Answer this question about the dataset:

Question: ${question}

Dataset Context:
- Name: ${dataset.name}
- Rows: ${dataset.rowCount}
- Columns: ${dataset.columns.map(col => `${col.name} (${col.type})`).join(', ')}

Sample data:
${JSON.stringify(dataset.sampleData.slice(0, 10), null, 2)}

Provide a clear, specific answer based on the actual data. If you cannot determine something from the data provided, say so. Keep the response under 200 words.`;

    return await this.generateResponse(prompt, { temperature: 0.4, max_tokens: 300 });
  }

  /**
   * Generate dashboard report summary
   */
  async generateDashboardReport(dashboardData: {
    name: string;
    chartCount: number;
    datasetInfo: {
      name: string;
      rowCount: number;
      columns: string[];
    };
    insights: Array<{ title: string; content: string; }>;
  }): Promise<string> {
    const prompt = `Generate an executive summary report for this data dashboard:

Dashboard: ${dashboardData.name}
Charts: ${dashboardData.chartCount}
Dataset: ${dashboardData.datasetInfo.name} (${dashboardData.datasetInfo.rowCount} rows)
Key Columns: ${dashboardData.datasetInfo.columns.join(', ')}

Current Insights:
${dashboardData.insights.map(insight => `- ${insight.title}: ${insight.content}`).join('\n')}

Write a professional 2-paragraph executive summary that:
1. Summarizes the key findings and trends
2. Provides actionable recommendations

Keep it concise and business-focused.`;

    return await this.generateResponse(prompt, { temperature: 0.5, max_tokens: 400 });
  }

  /**
   * Fallback insights when AI is not available
   */
  private generateBasicInsights(dataset: {
    name: string;
    rowCount: number;
    columns: Array<{ name: string; type: string; }>;
  }) {
    return [
      {
        id: `fallback_${Date.now()}_1`,
        title: 'Dataset Overview',
        content: `Your dataset "${dataset.name}" contains ${dataset.rowCount} records with ${dataset.columns.length} columns. The data appears to be well-structured for analysis.`,
        type: 'trend' as const,
        confidence: 90
      },
      {
        id: `fallback_${Date.now()}_2`,
        title: 'Data Quality Assessment',
        content: `Found ${dataset.columns.filter(col => col.type === 'number').length} numeric columns and ${dataset.columns.filter(col => col.type === 'string').length} text columns. Consider checking for missing values and outliers.`,
        type: 'correlation' as const,
        confidence: 85
      }
    ];
  }
}

export const ollamaService = new OllamaService();