import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { dataProcessor } from '../utils/dataProcessor';
import * as FileSystem from 'expo-file-system';

const CSVTestComponent = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createTestCSV = async () => {
    try {
      const testCSVContent = `Name,Age,City,Email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;

      const fileUri = FileSystem.documentDirectory + 'test.csv';
      await FileSystem.writeAsStringAsync(fileUri, testCSVContent);
      
      return fileUri;
    } catch (error) {
      console.error('Failed to create test CSV:', error);
      throw error;
    }
  };

  const testCSVProcessing = async () => {
    setIsProcessing(true);
    try {
      console.log('Creating test CSV file...');
      const fileUri = await createTestCSV();
      console.log('Test CSV file created at:', fileUri);
      
      console.log('Processing CSV file...');
      const result = await dataProcessor.processCSVFile(fileUri, 'test.csv');
      console.log('CSV processing result:', result);
      
      Alert.alert(
        'CSV Processing Test',
        `Success!\nHeaders: ${result.headers.join(', ')}\nRows: ${result.rows.length}\nColumns: ${result.metadata.columnCount}`
      );
    } catch (error) {
      console.error('CSV processing test failed:', error);
      Alert.alert('CSV Processing Test Failed', (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isProcessing && styles.buttonDisabled]}
        onPress={testCSVProcessing}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Processing...' : 'Test CSV Processing'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CSVTestComponent;
