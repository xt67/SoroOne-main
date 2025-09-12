/**
 * Stress Level Dataset Processor
 * Specialized service for analyzing stress level data
 */

import { ImportedDataset, ChartData, AIInsight } from '../types';

export interface StressMetrics {
  totalRecords: number;
  averageStressLevel: number;
  stressDistribution: { level: number; count: number; percentage: number }[];
  highStressFactors: { factor: string; correlation: number }[];
  mentalHealthStats: {
    averageAnxiety: number;
    averageDepression: number;
    mentalHealthHistoryPercent: number;
  };
  academicImpact: {
    avgPerformanceByStress: { stressLevel: number; avgPerformance: number }[];
    studyLoadCorrelation: number;
  };
}

export class StressDataProcessor {
  private data: Record<string, any>[];

  constructor(dataset: ImportedDataset) {
    this.data = dataset.data;
  }

  /**
   * Calculate comprehensive stress metrics
   */
  calculateStressMetrics(): StressMetrics {
    const totalRecords = this.data.length;
    
    // Stress level distribution
    const stressLevels = this.data.map(row => parseInt(row.stress_level) || 0);
    const averageStressLevel = stressLevels.reduce((sum, level) => sum + level, 0) / totalRecords;
    
    const stressDistribution = [0, 1, 2].map(level => {
      const count = stressLevels.filter(s => s === level).length;
      return {
        level,
        count,
        percentage: (count / totalRecords) * 100
      };
    });

    // Mental health statistics
    const anxietyLevels = this.data.map(row => parseInt(row.anxiety_level) || 0);
    const depressionLevels = this.data.map(row => parseInt(row.depression) || 0);
    const mentalHealthHistory = this.data.map(row => parseInt(row.mental_health_history) || 0);
    
    const mentalHealthStats = {
      averageAnxiety: anxietyLevels.reduce((sum, level) => sum + level, 0) / totalRecords,
      averageDepression: depressionLevels.reduce((sum, level) => sum + level, 0) / totalRecords,
      mentalHealthHistoryPercent: (mentalHealthHistory.filter(h => h === 1).length / totalRecords) * 100
    };

    // Academic performance by stress level
    const avgPerformanceByStress = [0, 1, 2].map(stressLevel => {
      const recordsAtLevel = this.data.filter(row => parseInt(row.stress_level) === stressLevel);
      const avgPerformance = recordsAtLevel.length > 0 
        ? recordsAtLevel.reduce((sum, row) => sum + (parseInt(row.academic_performance) || 0), 0) / recordsAtLevel.length
        : 0;
      return { stressLevel, avgPerformance };
    });

    // High stress correlation factors
    const highStressFactors = this.calculateCorrelations();

    return {
      totalRecords,
      averageStressLevel,
      stressDistribution,
      highStressFactors,
      mentalHealthStats,
      academicImpact: {
        avgPerformanceByStress,
        studyLoadCorrelation: this.calculateCorrelation('study_load', 'stress_level')
      }
    };
  }

  /**
   * Generate chart data for stress visualization
   */
  generateStressCharts(): ChartData[] {
    const metrics = this.calculateStressMetrics();

    return [
      // Stress Level Distribution
      {
        id: 'stress-distribution',
        title: 'Stress Level Distribution',
        type: 'pie',
        data: metrics.stressDistribution.map(item => ({
          label: `Level ${item.level}`,
          value: item.count,
          color: item.level === 0 ? '#10B981' : item.level === 1 ? '#F59E0B' : '#EF4444'
        }))
      },
      
      // Mental Health vs Stress
      {
        id: 'mental-health-stress',
        title: 'Anxiety & Depression vs Stress Level',
        type: 'scatter',
        data: this.data.map(row => ({
          x: parseInt(row.anxiety_level) || 0,
          y: parseInt(row.depression) || 0,
          color: parseInt(row.stress_level) === 0 ? '#10B981' : 
                 parseInt(row.stress_level) === 1 ? '#F59E0B' : '#EF4444'
        }))
      },

      // Academic Performance by Stress
      {
        id: 'academic-stress',
        title: 'Academic Performance by Stress Level',
        type: 'bar',
        data: metrics.academicImpact.avgPerformanceByStress.map(item => ({
          label: `Stress Level ${item.stressLevel}`,
          value: item.avgPerformance,
          color: item.stressLevel === 0 ? '#10B981' : 
                 item.stressLevel === 1 ? '#F59E0B' : '#EF4444'
        }))
      }
    ];
  }

  /**
   * Generate AI insights for stress data
   */
  generateAIInsights(): AIInsight[] {
    const metrics = this.calculateStressMetrics();
    
    const insights: AIInsight[] = [
      {
        id: 'stress-overview',
        title: 'Stress Level Overview',
        type: 'summary',
        content: `Analysis of ${metrics.totalRecords} students shows an average stress level of ${metrics.averageStressLevel.toFixed(2)}. ${metrics.stressDistribution[2].percentage.toFixed(1)}% of students report high stress levels.`,
        confidence: 0.95,
        category: 'overview'
      },
      
      {
        id: 'mental-health-insight',
        title: 'Mental Health Impact',
        type: 'correlation',
        content: `Students with mental health history represent ${metrics.mentalHealthStats.mentalHealthHistoryPercent.toFixed(1)}% of the sample. Average anxiety level is ${metrics.mentalHealthStats.averageAnxiety.toFixed(1)} and depression level is ${metrics.mentalHealthStats.averageDepression.toFixed(1)}.`,
        confidence: 0.88,
        category: 'health'
      },

      {
        id: 'academic-insight',
        title: 'Academic Performance Correlation',
        type: 'trend',
        content: `There's a clear relationship between stress and academic performance. Students with low stress (Level 0) have an average academic performance of ${metrics.academicImpact.avgPerformanceByStress[0].avgPerformance.toFixed(1)}, while high stress students (Level 2) average ${metrics.academicImpact.avgPerformanceByStress[2].avgPerformance.toFixed(1)}.`,
        confidence: 0.92,
        category: 'academic'
      }
    ];

    // Add top stress factors insight
    if (metrics.highStressFactors.length > 0) {
      const topFactors = metrics.highStressFactors.slice(0, 3);
      insights.push({
        id: 'stress-factors',
        title: 'Key Stress Factors',
        type: 'recommendation',
        content: `The strongest predictors of high stress are: ${topFactors.map(f => f.factor).join(', ')}. Focus on these areas for stress reduction interventions.`,
        confidence: 0.85,
        category: 'factors'
      });
    }

    return insights;
  }

  /**
   * Calculate correlation between stress level and other factors
   */
  private calculateCorrelations(): { factor: string; correlation: number }[] {
    const factors = [
      'anxiety_level', 'depression', 'academic_performance', 'study_load',
      'future_career_concerns', 'peer_pressure', 'bullying', 'sleep_quality',
      'social_support', 'self_esteem'
    ];

    return factors
      .map(factor => ({
        factor: factor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        correlation: this.calculateCorrelation(factor, 'stress_level')
      }))
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
      .slice(0, 5);
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private calculateCorrelation(factor1: string, factor2: string): number {
    const pairs = this.data
      .map(row => [parseInt(row[factor1]) || 0, parseInt(row[factor2]) || 0])
      .filter(pair => !isNaN(pair[0]) && !isNaN(pair[1]));

    if (pairs.length < 2) return 0;

    const n = pairs.length;
    const sum1 = pairs.reduce((sum, pair) => sum + pair[0], 0);
    const sum2 = pairs.reduce((sum, pair) => sum + pair[1], 0);
    const sum1Sq = pairs.reduce((sum, pair) => sum + pair[0] * pair[0], 0);
    const sum2Sq = pairs.reduce((sum, pair) => sum + pair[1] * pair[1], 0);
    const pSum = pairs.reduce((sum, pair) => sum + pair[0] * pair[1], 0);

    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));

    return den === 0 ? 0 : num / den;
  }

  /**
   * Generate SQL queries for stress analysis
   */
  generateSQLQueries(): string[] {
    return [
      `-- Stress Level Distribution
SELECT stress_level, COUNT(*) as count, 
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM stress_data), 2) as percentage
FROM stress_data 
GROUP BY stress_level 
ORDER BY stress_level;`,

      `-- High Stress Students Profile
SELECT AVG(anxiety_level) as avg_anxiety,
       AVG(depression) as avg_depression,
       AVG(academic_performance) as avg_academic,
       AVG(sleep_quality) as avg_sleep
FROM stress_data 
WHERE stress_level = 2;`,

      `-- Correlation: Mental Health and Academic Performance
SELECT 
  CASE 
    WHEN mental_health_history = 1 THEN 'Has Mental Health History'
    ELSE 'No Mental Health History'
  END as mental_health_status,
  AVG(academic_performance) as avg_academic_performance,
  AVG(stress_level) as avg_stress_level,
  COUNT(*) as student_count
FROM stress_data
GROUP BY mental_health_history;`,

      `-- Environmental Factors Impact
SELECT 
  living_conditions,
  safety,
  noise_level,
  AVG(stress_level) as avg_stress,
  COUNT(*) as count
FROM stress_data
GROUP BY living_conditions, safety, noise_level
HAVING COUNT(*) > 5
ORDER BY avg_stress DESC;`,

      `-- Study Load vs Stress Analysis
SELECT 
  study_load,
  AVG(stress_level) as avg_stress,
  AVG(academic_performance) as avg_performance,
  COUNT(*) as student_count
FROM stress_data
GROUP BY study_load
ORDER BY study_load;`
    ];
  }
}
