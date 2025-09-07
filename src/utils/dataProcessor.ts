/**
 * Utility functions for data processing and validation
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import type { ImportedDataset } from '../types';

export interface ProcessedData {
  headers: string[];
  rows: any[][];
  metadata: {
    rowCount: number;
    columnCount: number;
    fileSize: number;
    fileName: string;
  };
}

/**
 * Process Excel file and extract data
 */
export const processExcelFile = async (fileUri: string, fileName: string): Promise<ProcessedData> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const workbook = XLSX.read(fileContent, { type: 'base64' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1) as any[][];
    
    return {
      headers,
      rows,
      metadata: {
        rowCount: rows.length,
        columnCount: headers.length,
        fileSize: 0, // Would be calculated from actual file
        fileName,
      },
    };
  } catch (error) {
    throw new Error(`Failed to process Excel file: ${error}`);
  }
};

/**
 * Test CSV processing with sample data
 */
export const testCSVProcessing = (): ProcessedData => {
  const sampleCSV = `Name,Age,City,Email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;

  try {
    const lines = sampleCSV.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));

    return {
      headers,
      rows,
      metadata: {
        rowCount: rows.length,
        columnCount: headers.length,
        fileSize: sampleCSV.length,
        fileName: 'test.csv',
      },
    };
  } catch (error) {
    throw new Error(`Test CSV processing failed: ${error}`);
  }
};

/**
 * Process CSV file and extract data
 */
export const processCSVFile = async (fileUri: string, fileName: string): Promise<ProcessedData> => {
  try {
    console.log('processCSVFile: Starting with URI:', fileUri);
    
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log('processCSVFile: File info:', fileInfo);
    
    if (!fileInfo.exists) {
      throw new Error(`File does not exist at URI: ${fileUri}`);
    }
    
    // Read the file content
    console.log('processCSVFile: Reading file content...');
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    console.log('processCSVFile: File content length:', fileContent.length);
    console.log('processCSVFile: First 200 chars:', fileContent.substring(0, 200));
    
    if (!fileContent || fileContent.trim().length === 0) {
      throw new Error('CSV file is empty or could not be read');
    }
    
    return new Promise((resolve, reject) => {
      console.log('processCSVFile: Starting Papa Parse...');
      Papa.parse<string[]>(fileContent, {
        complete: (results) => {
          try {
            console.log('processCSVFile: Papa Parse complete');
            console.log('processCSVFile: Results:', {
              dataLength: results.data?.length,
              errors: results.errors,
              meta: results.meta
            });
            
            if (results.errors && results.errors.length > 0) {
              console.warn('processCSVFile: Parse errors:', results.errors);
            }
            
            if (!results.data || results.data.length === 0) {
              reject(new Error('CSV file appears to be empty or could not be parsed'));
              return;
            }

            const headers = results.data[0] as string[];
            console.log('processCSVFile: Headers:', headers);
            
            if (!headers || headers.length === 0) {
              reject(new Error('CSV file has no headers'));
              return;
            }
            
            const rows = results.data.slice(1).filter(row => 
              Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
            ) as any[][];
            
            console.log('processCSVFile: Filtered rows count:', rows.length);
            console.log('processCSVFile: First row sample:', rows[0]);
            
            const processedData = {
              headers: headers.map(h => h?.toString() || ''),
              rows,
              metadata: {
                rowCount: rows.length,
                columnCount: headers.length,
                fileSize: fileInfo.size || fileContent.length,
                fileName,
              },
            };
            
            console.log('processCSVFile: Processing complete, returning data');
            resolve(processedData);
          } catch (parseError) {
            console.error('processCSVFile: Error in parse completion:', parseError);
            reject(new Error(`Failed to parse CSV data: ${parseError}`));
          }
        },
        error: (error: any) => {
          console.error('processCSVFile: Papa Parse error:', error);
          reject(new Error(`Failed to process CSV file: ${error.message || error}`));
        },
        header: false,
        skipEmptyLines: true,
        delimiter: '', // Auto-detect delimiter
        dynamicTyping: false, // Keep all data as strings for now
      });
    });
  } catch (error) {
    console.error('processCSVFile: Outer catch error:', error);
    throw new Error(`Failed to read CSV file: ${error}`);
  }
};

/**
 * Process SQL file and extract basic structure
 */
export const processSQLFile = async (fileUri: string, fileName: string): Promise<ProcessedData> => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    // For SQL files, we'll extract basic info and return placeholder data
    // In a real implementation, this would parse SQL statements and execute them
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const nonCommentLines = lines.filter(line => !line.trim().startsWith('--'));
    
    return {
      headers: ['SQL_Statement', 'Line_Number'],
      rows: nonCommentLines.map((line, index) => [line.trim(), index + 1]),
      metadata: {
        rowCount: nonCommentLines.length,
        columnCount: 2,
        fileSize: (fileInfo.exists && 'size' in fileInfo) ? fileInfo.size : fileContent.length,
        fileName,
      },
    };
  } catch (error) {
    throw new Error(`Failed to process SQL file: ${(error as Error).message}`);
  }
};

/**
 * Validate data quality and detect issues
 */
export const validateDataQuality = (data: ProcessedData) => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for empty columns
  const emptyColumns = data.headers.filter((header, index) => {
    return data.rows.every(row => !row[index] || row[index] === '');
  });
  
  if (emptyColumns.length > 0) {
    issues.push(`Empty columns detected: ${emptyColumns.join(', ')}`);
    suggestions.push('Consider removing empty columns or filling with default values');
  }
  
  // Check for missing values
  const missingValueCounts = data.headers.map((header, index) => {
    const missing = data.rows.filter(row => !row[index] || row[index] === '').length;
    return { column: header, missing, percentage: (missing / data.rows.length) * 100 };
  });
  
  const highMissingColumns = missingValueCounts.filter(col => col.percentage > 20);
  if (highMissingColumns.length > 0) {
    issues.push(`High missing values in: ${highMissingColumns.map(col => col.column).join(', ')}`);
    suggestions.push('Consider data imputation or column removal for high missing value columns');
  }
  
  // Check data types consistency
  const typeInconsistencies = data.headers.map((header, index) => {
    const columnValues = data.rows.map(row => row[index]).filter(val => val !== null && val !== '');
    const types = new Set(columnValues.map(val => typeof val));
    return { column: header, types: Array.from(types) };
  }).filter(col => col.types.length > 1);
  
  if (typeInconsistencies.length > 0) {
    issues.push(`Mixed data types in: ${typeInconsistencies.map(col => col.column).join(', ')}`);
    suggestions.push('Ensure consistent data types within columns');
  }
  
  return { issues, suggestions };
};

/**
 * Generate basic statistics for numeric columns
 */
export const generateColumnStats = (data: ProcessedData) => {
  return data.headers.map((header, index) => {
    const columnValues = data.rows.map(row => row[index]).filter(val => val !== null && val !== '');
    const numericValues = columnValues.filter(val => !isNaN(Number(val))).map(Number);
    
    if (numericValues.length > 0) {
      const sorted = numericValues.sort((a, b) => a - b);
      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const mean = sum / numericValues.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      return {
        column: header,
        type: 'numeric',
        count: numericValues.length,
        mean: Number(mean.toFixed(2)),
        median,
        min,
        max,
        missing: data.rows.length - columnValues.length,
      };
    } else {
      const uniqueValues = new Set(columnValues);
      return {
        column: header,
        type: 'categorical',
        count: columnValues.length,
        unique: uniqueValues.size,
        missing: data.rows.length - columnValues.length,
        topValues: Array.from(uniqueValues).slice(0, 5),
      };
    }
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format numbers for display
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Main data processor object with all utility functions
 */
export const dataProcessor = {
  processExcelFile,
  processCSVFile,
  processSQLFile,
  validateDataQuality,
  generateColumnStats,
  formatFileSize,
  formatNumber,
  testCSVProcessing,
};

export default dataProcessor;
