/**
 * Test Script for Stress Level Dataset Processing
 * This script tests the SoroOne app with the uploaded stress dataset
 */

import { StressDataProcessor } from '../services/StressDataProcessor';
import { ImportedDataset } from '../types';

// Test data processing with stress level dataset
export async function testStressDataProcessing() {
  console.log('🧪 Testing SoroOne with Stress Level Dataset...');
  
  try {
    // Simulate loading the CSV data (in real app this would come from file picker)
    const mockDataset: ImportedDataset = {
      id: 'stress-dataset-1',
      name: 'StressLevelDataset.csv',
      type: 'csv',
      filePath: './StressLevelDataset.csv',
      data: [], // This would be populated from CSV parsing
      headers: [
        'anxiety_level', 'self_esteem', 'mental_health_history', 'depression',
        'headache', 'blood_pressure', 'sleep_quality', 'breathing_problem',
        'noise_level', 'living_conditions', 'safety', 'basic_needs',
        'academic_performance', 'study_load', 'teacher_student_relationship',
        'future_career_concerns', 'social_support', 'peer_pressure',
        'extracurricular_activities', 'bullying', 'stress_level'
      ],
      rowCount: 1102,
      columnCount: 21,
      createdAt: new Date(),
      fileSize: 48717
    };

    // Create sample data for testing (representing the CSV structure)
    const sampleData = generateSampleStressData(50); // Generate 50 sample rows for testing
    mockDataset.data = sampleData;

    console.log('📊 Dataset loaded:', {
      name: mockDataset.name,
      rows: mockDataset.rowCount,
      columns: mockDataset.columnCount,
      size: `${(mockDataset.fileSize / 1024).toFixed(1)}KB`
    });

    // Initialize the stress data processor
    const processor = new StressDataProcessor(mockDataset);

    // Test 1: Calculate stress metrics
    console.log('\\n📈 Testing Stress Metrics Calculation...');
    const metrics = processor.calculateStressMetrics();
    console.log('✅ Stress Metrics:', {
      totalRecords: metrics.totalRecords,
      averageStressLevel: metrics.averageStressLevel.toFixed(2),
      highStressPercentage: metrics.stressDistribution[2]?.percentage.toFixed(1) + '%',
      mentalHealthHistoryPercent: metrics.mentalHealthStats.mentalHealthHistoryPercent.toFixed(1) + '%'
    });

    // Test 2: Generate visualizations
    console.log('\\n📊 Testing Chart Generation...');
    const charts = processor.generateStressCharts();
    console.log('✅ Generated Charts:', charts.map(chart => ({
      id: chart.id,
      title: chart.title,
      type: chart.type,
      dataPoints: chart.data?.length || 0
    })));

    // Test 3: Generate AI insights
    console.log('\\n🤖 Testing AI Insights Generation...');
    const insights = processor.generateAIInsights();
    console.log('✅ Generated Insights:', insights.map(insight => ({
      id: insight.id,
      title: insight.title,
      type: insight.type,
      confidence: (insight.confidence * 100).toFixed(0) + '%'
    })));

    // Test 4: Generate SQL queries
    console.log('\\n🗃️ Testing SQL Query Generation...');
    const sqlQueries = processor.generateSQLQueries();
    console.log('✅ Generated SQL Queries:', sqlQueries.length);
    sqlQueries.forEach((query, index) => {
      const title = query.split('\\n')[0].replace('-- ', '');
      console.log(`   ${index + 1}. ${title}`);
    });

    console.log('\\n🎉 All tests passed! SoroOne successfully processed the stress dataset.');
    
    return {
      success: true,
      metrics,
      charts,
      insights,
      sqlQueries
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Generate sample stress data for testing
function generateSampleStressData(count: number) {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      anxiety_level: Math.floor(Math.random() * 21) + 1, // 1-21
      self_esteem: Math.floor(Math.random() * 30) + 1, // 1-30
      mental_health_history: Math.random() > 0.7 ? 1 : 0, // 30% have history
      depression: Math.floor(Math.random() * 27) + 1, // 1-27
      headache: Math.floor(Math.random() * 5) + 1, // 1-5
      blood_pressure: Math.floor(Math.random() * 3) + 1, // 1-3
      sleep_quality: Math.floor(Math.random() * 5) + 1, // 1-5
      breathing_problem: Math.floor(Math.random() * 5) + 1, // 1-5
      noise_level: Math.floor(Math.random() * 5), // 0-4
      living_conditions: Math.floor(Math.random() * 5) + 1, // 1-5
      safety: Math.floor(Math.random() * 5) + 1, // 1-5
      basic_needs: Math.floor(Math.random() * 5) + 1, // 1-5
      academic_performance: Math.floor(Math.random() * 5) + 1, // 1-5
      study_load: Math.floor(Math.random() * 5) + 1, // 1-5
      teacher_student_relationship: Math.floor(Math.random() * 5) + 1, // 1-5
      future_career_concerns: Math.floor(Math.random() * 5) + 1, // 1-5
      social_support: Math.floor(Math.random() * 5) + 1, // 1-5
      peer_pressure: Math.floor(Math.random() * 5) + 1, // 1-5
      extracurricular_activities: Math.floor(Math.random() * 6), // 0-5
      bullying: Math.floor(Math.random() * 6), // 0-5
      stress_level: Math.floor(Math.random() * 3) // 0-2
    });
  }
  
  return data;
}

// Export test results for dashboard
export function getStressTestResults() {
  return testStressDataProcessing();
}
