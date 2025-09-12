/**
 * CSV Parser for Stress Level Dataset
 * Reads and parses the uploaded CSV file
 */

import { ImportedDataset } from '../types';

export async function parseStressLevelCSV(filePath: string): Promise<ImportedDataset> {
  try {
    // For testing, we'll read the file content
    // In a real mobile app, this would use expo-file-system
    
    const fileContent = await readCSVFile(filePath);
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse data rows
    const data: Record<string, any>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to parse as number, otherwise keep as string
          row[header] = isNaN(Number(value)) ? value : Number(value);
        });
        data.push(row);
      }
    }

    const dataset: ImportedDataset = {
      id: `stress-dataset-${Date.now()}`,
      name: 'StressLevelDataset.csv',
      type: 'csv',
      filePath,
      data,
      headers,
      rowCount: data.length,
      columnCount: headers.length,
      createdAt: new Date(),
      fileSize: fileContent.length
    };

    console.log('📄 CSV Parsed Successfully:', {
      rows: dataset.rowCount,
      columns: dataset.columnCount,
      headers: dataset.headers.slice(0, 5).join(', ') + '...',
      sampleData: dataset.data.slice(0, 2)
    });

    return dataset;

  } catch (error) {
    console.error('❌ Failed to parse CSV:', error);
    throw new Error(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Mock function to read CSV file
// In real app, this would use expo-file-system
async function readCSVFile(filePath: string): Promise<string> {
  // This is a mock implementation for testing
  // In the real app, you would use:
  // import * as FileSystem from 'expo-file-system';
  // return await FileSystem.readAsStringAsync(filePath);
  
  // For now, return sample CSV content based on your dataset structure
  return `anxiety_level,self_esteem,mental_health_history,depression,headache,blood_pressure,sleep_quality,breathing_problem,noise_level,living_conditions,safety,basic_needs,academic_performance,study_load,teacher_student_relationship,future_career_concerns,social_support,peer_pressure,extracurricular_activities,bullying,stress_level
14,20,0,11,2,1,2,4,2,3,3,2,3,2,3,3,2,3,3,2,1
15,8,1,15,5,3,1,4,3,1,2,2,1,4,1,5,1,4,5,5,2
12,18,1,14,2,1,2,2,2,2,3,2,2,3,3,2,2,3,2,2,1
16,12,1,15,4,3,1,3,4,2,2,2,2,4,1,4,1,4,4,5,2
16,28,0,7,2,3,5,1,3,2,4,3,4,3,1,2,1,5,0,5,1
20,13,1,21,3,3,1,4,3,2,2,1,2,5,2,5,1,4,4,5,2
4,26,0,6,1,2,4,1,1,4,4,4,5,1,4,1,3,2,2,1,0
17,3,1,22,4,3,1,5,3,1,1,1,1,3,2,4,1,4,4,5,2
13,22,1,12,3,1,2,4,3,3,3,3,3,3,2,3,3,3,2,2,1
6,8,0,27,4,3,1,2,0,5,2,2,2,2,1,5,1,5,3,4,1`;
}

// Validate stress dataset structure
export function validateStressDataset(dataset: ImportedDataset): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const requiredColumns = [
    'anxiety_level', 'self_esteem', 'mental_health_history', 'depression',
    'stress_level', 'academic_performance', 'sleep_quality'
  ];

  // Check if required columns exist
  const missingColumns = requiredColumns.filter(col => !dataset.headers.includes(col));
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  // Check data integrity
  if (dataset.rowCount === 0) {
    errors.push('Dataset contains no data rows');
  }

  if (dataset.columnCount < 10) {
    errors.push('Dataset should have at least 10 columns for meaningful analysis');
  }

  // Validate stress_level values (should be 0, 1, or 2)
  if (dataset.headers.includes('stress_level')) {
    const invalidStressLevels = dataset.data.filter(row => {
      const stressLevel = row.stress_level;
      return stressLevel !== 0 && stressLevel !== 1 && stressLevel !== 2;
    });
    
    if (invalidStressLevels.length > 0) {
      errors.push(`Found ${invalidStressLevels.length} rows with invalid stress_level values (should be 0, 1, or 2)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
