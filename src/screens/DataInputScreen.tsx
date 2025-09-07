import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { dataProcessor } from '../utils/dataProcessor';
import { dataService } from '../services/DataService';
import { useTheme } from '../styles/ThemeProvider';
import { DatasetActionModal } from '../components/DatasetActionModal';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: '#FFFFFF' }]}>
            Processing file...
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Import Your Data
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Transform your data into powerful insights
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleFilePick('csv')}
            disabled={isLoading}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="flash" size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Quick Import</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: theme.colors.secondary }]}
            onPress={testCSVProcessing}
            disabled={isLoading}
          >
            <View style={styles.quickActionContent}>
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Try Demo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Import Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Choose Import Method
          </Text>
          
          <View style={styles.importGrid}>
            <Card variant="elevated" style={styles.importCard}>
              <TouchableOpacity 
                style={styles.importOption}
                onPress={() => handleFilePick('excel')}
                disabled={isLoading}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="document-text" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.importContent}>
                  <Text style={[styles.importTitle, { color: theme.colors.textPrimary }]}>
                    Excel Files
                  </Text>
                  <Text style={[styles.importDescription, { color: theme.colors.textSecondary }]}>
                    Import .xlsx and .xls spreadsheets
                  </Text>
                  <View style={styles.formats}>
                    <Text style={[styles.formatBadge, { backgroundColor: theme.colors.success, color: '#FFFFFF' }]}>
                      .xlsx
                    </Text>
                    <Text style={[styles.formatBadge, { backgroundColor: theme.colors.success, color: '#FFFFFF' }]}>
                      .xls
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <Card variant="elevated" style={styles.importCard}>
              <TouchableOpacity 
                style={styles.importOption}
                onPress={() => handleFilePick('csv')}
                disabled={isLoading}
              >
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="grid" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.importContent}>
                  <Text style={[styles.importTitle, { color: theme.colors.textPrimary }]}>
                    CSV Files
                  </Text>
                  <Text style={[styles.importDescription, { color: theme.colors.textSecondary }]}>
                    Quick import for structured data
                  </Text>
                  <View style={styles.formats}>
                    <Text style={[styles.formatBadge, { backgroundColor: theme.colors.primary, color: '#FFFFFF' }]}>
                      .csv
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>

            <Card variant="elevated" style={styles.importCard}>
              <TouchableOpacity 
                style={styles.importOption}
                onPress={() => handleFilePick('sql')}
                disabled={isLoading}
              >
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
                  <Ionicons name="server" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.importContent}>
                  <Text style={[styles.importTitle, { color: theme.colors.textPrimary }]}>
                    SQL Files
                  </Text>
                  <Text style={[styles.importDescription, { color: theme.colors.textSecondary }]}>
                    Database exports and scripts
                  </Text>
                  <View style={styles.formats}>
                    <Text style={[styles.formatBadge, { backgroundColor: theme.colors.accent, color: '#FFFFFF' }]}>
                      .sql
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        </View>

        {/* Recent Files */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Recent Files
            </Text>
            {recentFiles.length > 0 && (
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentFiles.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                  No files yet
                </Text>
                <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                  Import your first file to get started with data analysis
                </Text>
                <Button
                  title="Import File"
                  onPress={() => handleFilePick('csv')}
                  variant="outline"
                  size="small"
                  icon="add"
                  style={{ marginTop: 16 }}
                />
              </View>
            </Card>
          ) : (
            <View style={styles.recentList}>
              {recentFiles.slice(0, 3).map((file) => (
                <Card key={file.id} variant="outlined" style={styles.recentCard}>
                  <TouchableOpacity style={styles.recentItem}>
                    <View style={styles.recentIcon}>
                      <Ionicons 
                        name={getFileIcon(file.type)} 
                        size={24} 
                        color={getFileColor(file.type)} 
                      />
                    </View>
                    <View style={styles.recentInfo}>
                      <Text style={[styles.recentName, { color: theme.colors.textPrimary }]}>
                        {file.name}
                      </Text>
                      <Text style={[styles.recentMeta, { color: theme.colors.textSecondary }]}>
                        {file.rowCount?.toLocaleString()} rows • {file.columnCount} columns
                      </Text>
                      <Text style={[styles.recentDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(file.createdAt)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <DatasetActionModal
        visible={showActionModal}
        dataset={currentDataset}
        onClose={handleCloseModal}
        onCreateDashboard={handleCreateDashboard}
        onGetAIInsights={handleGetAIInsights}
        onEditWithSQL={handleEditWithSQL}
      />
    </SafeAreaView>
  );
}

// Helper functions
const getFileIcon = (type: string) => {
  switch (type) {
    case 'excel':
      return 'document-text';
    case 'csv':
      return 'grid';
    case 'sql':
      return 'server';
    default:
      return 'document';
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'excel':
      return '#10B981';
    case 'csv':
      return '#6366F1';
    case 'sql':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return dateObj.toLocaleDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  importGrid: {
    gap: 16,
  },
  importCard: {
    marginBottom: 0,
  },
  importOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  importContent: {
    flex: 1,
  },
  importTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  importDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  formats: {
    flexDirection: 'row',
    gap: 8,
  },
  formatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
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
  recentList: {
    gap: 12,
  },
  recentCard: {
    padding: 0,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: 12,
  },
});
