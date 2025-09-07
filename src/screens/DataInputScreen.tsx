import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { dataProcessor } from '../utils/dataProcessor';
import { dataService } from '../services/DataService';
import { useTheme } from '../styles/ThemeProvider';
import { DatasetActionModal } from '../components/DatasetActionModal';
import type { ImportedDataset, NavigationParamList } from '../types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import CSVTestComponent from '../components/CSVTestComponent';

type DataInputNavigationProp = BottomTabNavigationProp<NavigationParamList, 'DataInput'>;

export default function DataInputScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<DataInputNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState<ImportedDataset[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<ImportedDataset | null>(null);

  useEffect(() => {
    loadRecentFiles();
    initializeDataService();
  }, []);

  const initializeDataService = async () => {
    try {
      await dataService.initialize();
    } catch (error) {
      console.error('Failed to initialize data service:', error);
    }
  };

  const loadRecentFiles = async () => {
    try {
      console.log('DataInputScreen: Loading recent files...');
      await dataService.initialize();
      const sources = await dataService.getDataSources();
      console.log('DataInputScreen: Loaded data sources:', sources.length);
      
      // Convert DataSource objects to ImportedDataset format for display
      const recentDatasets: ImportedDataset[] = sources
        .filter(source => source.type !== 'database') // Filter out database sources
        .map(source => ({
          id: source.id,
          name: source.name,
          type: source.type as 'excel' | 'csv' | 'sql',
          filePath: source.filePath || '',
          data: [], // We don't load the actual data here, just metadata
          headers: [],
          rowCount: source.rowCount,
          columnCount: source.columnCount,
          createdAt: source.createdAt,
          fileSize: source.size,
        }));
      
      setRecentFiles(recentDatasets);
      console.log('DataInputScreen: Recent files loaded successfully');
    } catch (error) {
      console.error('DataInputScreen: Failed to load recent files:', error);
    }
  };

  const handleFilePick = async (type: 'excel' | 'csv' | 'sql') => {
    console.log('\n=== FILE UPLOAD DEBUG ===');
    console.log(`1. Starting file picker for type: ${type}`);
    
    try {
      setIsLoading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: getDocumentTypes(type),
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('2. Document picker result:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('3. Selected file details:', JSON.stringify({
          name: asset.name,
          size: asset.size,
          uri: asset.uri,
          mimeType: asset.mimeType
        }, null, 2));
        
        console.log('4. Starting file processing...');
        await processFile(asset, type);
        console.log('5. File processing completed successfully!');
      } else {
        console.log('3. File selection was canceled or no file selected');
        console.log('   Result details:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('ERROR in handleFilePick:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack,
        type: type
      });
      Alert.alert('Error', 'Failed to pick file: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      console.log('=== FILE UPLOAD DEBUG END ===\n');
    }
  };

  const getDocumentTypes = (type: 'excel' | 'csv' | 'sql') => {
    switch (type) {
      case 'excel':
        return ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      case 'csv':
        // Include multiple MIME types for CSV files as different systems may use different ones
        return [
          'text/csv', 
          'text/comma-separated-values', 
          'application/csv',
          'application/vnd.ms-excel', // Some systems report CSV as Excel
          'text/plain' // Fallback for plain text CSV files
        ];
      case 'sql':
        return ['text/sql', 'application/sql', 'text/x-sql', 'text/plain'];
      default:
        return ['*/*'];
    }
  };

  const testCSVProcessing = async () => {
    try {
      console.log('Testing CSV processing...');
      const testData = dataProcessor.testCSVProcessing();
      console.log('Test CSV data:', testData);
      
      Alert.alert(
        'CSV Test Success',
        `Test CSV processed successfully!\nRows: ${testData.metadata.rowCount}\nColumns: ${testData.metadata.columnCount}`
      );
    } catch (error) {
      console.error('CSV test error:', error);
      Alert.alert('CSV Test Error', (error as Error).message);
    }
  };

  const processFile = async (asset: DocumentPicker.DocumentPickerAsset, type: 'excel' | 'csv' | 'sql') => {
    try {
      console.log(`Processing ${type} file:`, asset.name, asset.uri);
      console.log('Asset details:', {
        name: asset.name,
        size: asset.size,
        uri: asset.uri,
        mimeType: asset.mimeType
      });
      
      let processedData;
      
      switch (type) {
        case 'excel':
          console.log('Starting Excel processing...');
          processedData = await dataProcessor.processExcelFile(asset.uri, asset.name);
          break;
        case 'csv':
          console.log('Starting CSV processing...');
          console.log('File URI:', asset.uri);
          processedData = await dataProcessor.processCSVFile(asset.uri, asset.name);
          console.log('CSV processing completed successfully');
          console.log('Processed data preview:', {
            headers: processedData.headers,
            rowCount: processedData.rows.length,
            firstRow: processedData.rows[0]
          });
          break;
        case 'sql':
          console.log('Starting SQL processing...');
          processedData = await dataProcessor.processSQLFile(asset.uri, asset.name);
          break;
        default:
          throw new Error('Unsupported file type');
      }

      console.log('File processed successfully. Metadata:', processedData.metadata);

      const dataSourceId = `ds_${Date.now()}`;
      const dataset: ImportedDataset = {
        id: `dataset_${Date.now()}`,
        name: asset.name,
        type,
        filePath: asset.uri,
        data: processedData.rows.map((row: any[]) => {
          const obj: Record<string, any> = {};
          processedData.headers.forEach((header: string, index: number) => {
            obj[header] = row[index];
          });
          return obj;
        }),
        headers: processedData.headers,
        rowCount: processedData.metadata.rowCount,
        columnCount: processedData.metadata.columnCount,
        createdAt: new Date(),
        fileSize: processedData.metadata.fileSize,
      };

      console.log('Saving data source and dataset...');
      
      // Save data source record
      await dataService.saveDataSource({
        id: dataSourceId,
        name: dataset.name,
        type: type as 'csv' | 'excel' | 'sql',
        filePath: dataset.filePath,
        createdAt: dataset.createdAt,
        updatedAt: dataset.createdAt,
        size: dataset.fileSize || 0,
        rowCount: dataset.rowCount,
        columnCount: dataset.columnCount,
      });

      // Save dataset
      await dataService.saveDataset({
        id: dataset.id,
        sourceId: dataSourceId,
        name: dataset.name,
        columns: processedData.headers.map((header: string) => ({
          name: header,
          type: 'string' as const,
          nullable: true,
          unique: false,
          samples: [],
        })),
        data: dataset.data,
        metadata: {
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount,
          dataTypes: {},
          missingValues: {},
        },
      });

      console.log('Data saved successfully');

      // Show action modal instead of simple alert
      setCurrentDataset(dataset);
      setShowActionModal(true);
    } catch (error) {
      console.error('File processing error - Full details:', {
        error: error,
        message: (error as Error).message,
        stack: (error as Error).stack,
        assetName: asset?.name,
        assetUri: asset?.uri,
        fileType: type
      });
      
      let errorMessage = 'Failed to process file';
      if (error instanceof Error) {
        errorMessage += ': ' + error.message;
      }
      
      Alert.alert('Error', errorMessage, [
        { text: 'OK' },
        { text: 'View Console', onPress: () => console.log('Check the console for detailed error information') }
      ]);
    }
  };

  // Action handlers for the dataset options
  const handleCreateDashboard = async () => {
    setShowActionModal(false);
    if (!currentDataset) return;

    try {
      // Create a dashboard automatically from the current dataset
      const now = new Date();
      const dashboard = {
        id: `dashboard_${Date.now()}`,
        name: `${currentDataset.name} Dashboard`,
        description: `Auto-generated dashboard for ${currentDataset.name}`,
        charts: [
          {
            id: 'chart_1',
            type: 'bar' as const,
            title: `${currentDataset.name} Overview`,
            datasetId: currentDataset.id,
            xColumn: currentDataset.headers[0] || 'Column1',
            yColumn: currentDataset.headers[1] || 'Column2',
            styling: {
              colors: ['#2563EB', '#10B981', '#F59E0B'],
              theme: 'light' as const,
              showLegend: true,
              showGrid: true
            }
          }
        ],
        layout: [
          { chartId: 'chart_1', x: 0, y: 0, width: 2, height: 1 }
        ],
        createdAt: now,
        updatedAt: now,
        isShared: false,
        theme: 'auto' as const
      };

      await dataService.saveDashboard(dashboard);
      
      Alert.alert(
        'Dashboard Created!', 
        `Dashboard "${dashboard.name}" has been created successfully.`,
        [
          { 
            text: 'View Dashboard', 
            onPress: () => navigation.navigate('Dashboard' as any) 
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      console.error('Failed to create dashboard:', error);
      Alert.alert('Error', 'Failed to create dashboard: ' + (error as Error).message);
    }
  };

  const handleGetAIInsights = () => {
    setShowActionModal(false);
    if (!currentDataset) return;

    // Navigate to AI Insights screen with the dataset context
    navigation.navigate('AIInsights' as any);
    
    // Show a helpful message
    setTimeout(() => {
      Alert.alert(
        'AI Insights', 
        `You can now ask questions about your "${currentDataset.name}" dataset using natural language.`,
        [{ text: 'Got it!' }]
      );
    }, 500);
  };

  const handleEditWithSQL = () => {
    setShowActionModal(false);
    if (!currentDataset) return;

    // Navigate to SQL Editor screen
    navigation.navigate('SQLEditor' as any);
    
    // Show a helpful message
    setTimeout(() => {
      Alert.alert(
        'SQL Query Editor', 
        `You can now write SQL queries to analyze your "${currentDataset.name}" dataset.`,
        [{ text: 'Got it!' }]
      );
    }, 500);
  };

  const handleCloseModal = () => {
    setShowActionModal(false);
    setCurrentDataset(null);
    loadRecentFiles(); // Refresh the recent files list
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>
            Processing file...
          </Text>
        </View>
      )}

      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Import Your Data</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose from multiple data sources to get started
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Temporary CSV Test Button */}
        <TouchableOpacity 
          style={[styles.testButton, { backgroundColor: '#FFC107' }]}
          onPress={testCSVProcessing}
        >
          <Text style={styles.testButtonText}>Test CSV Processing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleFilePick('excel')}
          disabled={isLoading}
        >
          <Ionicons name="document-outline" size={48} color="#10B981" />
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>Excel Files</Text>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            Upload .xlsx and .xls files directly from your device
          </Text>
          <View style={styles.supportedFormats}>
            <Text style={styles.formatText}>.xlsx</Text>
            <Text style={styles.formatText}>.xls</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleFilePick('csv')}
          disabled={isLoading}
        >
          <Ionicons name="grid-outline" size={48} color="#2563EB" />
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>CSV Files</Text>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            Import comma-separated values files for quick analysis
          </Text>
          <View style={styles.supportedFormats}>
            <Text style={styles.formatText}>.csv</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleFilePick('sql')}
          disabled={isLoading}
        >
          <Ionicons name="server-outline" size={48} color="#8B5CF6" />
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>SQL Files</Text>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            Import SQL dump files and database scripts
          </Text>
          <View style={styles.supportedFormats}>
            <Text style={styles.formatText}>.sql</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Temporary CSV Test Component for debugging - Commented out for production */}
      {/* 
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Debug CSV Processing</Text>
        <CSVTestComponent />
      </View>
      */}

      <View style={styles.recentSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Recent Files</Text>
        {recentFiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No recent files</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Your recently imported files will appear here
            </Text>
          </View>
        ) : (
          <View>
            {recentFiles.map((file) => (
              <TouchableOpacity 
                key={file.id} 
                style={[styles.recentFileItem, { backgroundColor: theme.colors.surface }]}
              >
                <Ionicons 
                  name={file.type === 'excel' ? 'document-outline' : file.type === 'csv' ? 'grid-outline' : 'server-outline'} 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <View style={styles.fileInfo}>
                  <Text style={[styles.fileName, { color: theme.colors.textPrimary }]}>{file.name}</Text>
                  <Text style={[styles.fileDetails, { color: theme.colors.textSecondary }]}>
                    {file.rowCount} rows • {file.columnCount} columns
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* CSV Upload Troubleshooting Guide:
       * 
       * If CSV files are not opening or processing correctly, check these common issues:
       * 
       * 1. File picker issues:
       *    - Check if file is selected successfully
       *    - Verify MIME type is supported
       *    - Ensure file URI is valid
       * 
       * 2. File reading issues:
       *    - Check if file exists at URI
       *    - Verify file permissions
       *    - Ensure file content is readable
       * 
       * 3. CSV parsing issues:
       *    - Check file format (UTF-8 encoding)
       *    - Verify CSV structure (headers, delimiters)
       *    - Look for special characters or encoding issues
       * 
       * 4. Database saving issues:
       *    - Check database initialization
       *    - Verify data transformation
       *    - Check AsyncStorage permissions
       * 
       * Enable detailed console logging to debug each step.
       */}

      {/* Dataset Action Modal */}
      <DatasetActionModal
        visible={showActionModal}
        dataset={currentDataset}
        onClose={handleCloseModal}
        onCreateDashboard={handleCreateDashboard}
        onGetAIInsights={handleGetAIInsights}
        onEditWithSQL={handleEditWithSQL}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
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
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  supportedFormats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  formatText: {
    fontSize: 12,
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recentFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 14,
  },
  testButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  testButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
