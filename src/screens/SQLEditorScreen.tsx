import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../styles/ThemeProvider';
import { dataService } from '../services/DataService';
import type { Dataset } from '../types';

export default function SQLEditorScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('SELECT * FROM dataset LIMIT 10;');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [resultColumns, setResultColumns] = useState<string[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentDataset();
  }, []);

  const loadCurrentDataset = async () => {
    try {
      await dataService.initialize();
      const datasets = await dataService.getDatasets();
      if (datasets.length > 0) {
        const latestDataset = datasets[datasets.length - 1];
        setCurrentDataset(latestDataset);
        // Update default query with actual dataset info
        if (latestDataset.data.length > 0) {
          const columns = Object.keys(latestDataset.data[0]);
          setQuery(`SELECT ${columns.slice(0, 3).join(', ')} FROM dataset LIMIT 10;`);
        }
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
    }
  };

  const executeQuery = async () => {
    if (!currentDataset) {
      Alert.alert('No Data', 'Please upload a dataset first to run SQL queries.');
      return;
    }

    setIsExecuting(true);
    setError(null);
    
    try {
      const result = await simulateSQL(query, currentDataset);
      setQueryResults(result.data);
      setResultColumns(result.columns);
    } catch (error) {
      setError((error as Error).message);
      setQueryResults([]);
      setResultColumns([]);
    }
    
    setIsExecuting(false);
  };

  const simulateSQL = async (sqlQuery: string, dataset: Dataset): Promise<{ data: any[], columns: string[] }> => {
    const dataRows = dataset.data;
    if (!dataRows || dataRows.length === 0) {
      throw new Error('Dataset is empty');
    }

    const allColumns = Object.keys(dataRows[0]);
    let query = sqlQuery.trim().toLowerCase();
    
    // Parse basic SELECT queries
    if (!query.startsWith('select')) {
      throw new Error('Only SELECT queries are supported');
    }

    // Extract columns (basic parsing)
    let selectedColumns = allColumns;
    const selectMatch = query.match(/select\s+(.*?)\s+from/);
    if (selectMatch) {
      const columnsPart = selectMatch[1].trim();
      if (columnsPart !== '*') {
        selectedColumns = columnsPart.split(',').map(col => col.trim());
        // Validate columns exist
        selectedColumns.forEach(col => {
          if (!allColumns.includes(col)) {
            throw new Error(`Column '${col}' does not exist. Available columns: ${allColumns.join(', ')}`);
          }
        });
      }
    }

    // Extract LIMIT
    let limitCount = dataRows.length;
    const limitMatch = query.match(/limit\s+(\d+)/);
    if (limitMatch) {
      limitCount = Math.min(parseInt(limitMatch[1]), dataRows.length);
    }

    // Extract WHERE conditions (basic support)
    let filteredData = dataRows;
    const whereMatch = query.match(/where\s+(.*?)(?:\s+limit|\s+order|$)/);
    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      // Simple equality check: column = 'value' or column = value
      const eqMatch = whereClause.match(/(\w+)\s*=\s*['"]?([^'"\s]+)['"]?/);
      if (eqMatch) {
        const [, column, value] = eqMatch;
        if (!allColumns.includes(column)) {
          throw new Error(`Column '${column}' does not exist in WHERE clause`);
        }
        filteredData = dataRows.filter(row => String(row[column]) === value);
      }
    }

    // Extract ORDER BY (basic support)
    const orderMatch = query.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/);
    if (orderMatch) {
      const [, column, direction = 'asc'] = orderMatch;
      if (!allColumns.includes(column)) {
        throw new Error(`Column '${column}' does not exist in ORDER BY clause`);
      }
      filteredData.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'desc' ? -comparison : comparison;
      });
    }

    // Apply LIMIT and column selection
    const resultData = filteredData.slice(0, limitCount).map(row => {
      const result: any = {};
      selectedColumns.forEach(col => {
        result[col] = row[col];
      });
      return result;
    });

    return {
      data: resultData,
      columns: selectedColumns
    };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.content}>
        {/* Toolbar */}
        <Card style={styles.toolbarCard}>
          <View style={styles.toolbar}>
            <Button
              title={isExecuting ? 'Executing...' : 'Run Query'}
              onPress={executeQuery}
              style={styles.runButton}
              disabled={isExecuting}
            />
            
            <View style={styles.toolbarActions}>
              <TouchableOpacity style={[styles.toolbarButton, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="save-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.toolbarButton, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="folder-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Editor */}
        <Card style={styles.editorCard}>
          <View style={styles.editorHeader}>
            <Text style={[styles.editorLabel, { color: theme.colors.textPrimary }]}>SQL Query Editor</Text>
          </View>
          <TextInput
            style={[styles.editor, { 
              backgroundColor: theme.colors.background,
              color: theme.colors.textPrimary,
              borderColor: theme.colors.border
            }]}
            value={query}
            onChangeText={setQuery}
            multiline
            placeholder="Enter your SQL query here..."
            placeholderTextColor={theme.colors.textSecondary}
            textAlignVertical="top"
          />
        </Card>

        {/* Results */}
        <Card style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: theme.colors.textPrimary }]}>Query Results</Text>
            <Text style={[styles.resultsInfo, { color: theme.colors.textSecondary }]}>
              {queryResults.length} rows returned
            </Text>
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>Query Error</Text>
              <Text style={[styles.errorDetails, { color: theme.colors.textSecondary }]}>{error}</Text>
            </View>
          ) : queryResults.length > 0 ? (
            <ScrollView horizontal style={styles.resultsTable}>
              <View>
                {/* Header */}
                <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: theme.colors.surface }]}>
                  {resultColumns.map((column, index) => (
                    <Text key={index} style={[styles.tableHeaderCell, { color: theme.colors.textPrimary }]}>
                      {column}
                    </Text>
                  ))}
                </View>
                
                {/* Data Rows */}
                <FlatList
                  data={queryResults}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: theme.colors.background } : { backgroundColor: theme.colors.surface }]}>
                      {resultColumns.map((column, colIndex) => (
                        <Text key={colIndex} style={[styles.tableCell, { color: theme.colors.textPrimary }]}>
                          {String(item[column] || '')}
                        </Text>
                      ))}
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyResults}>
              <Ionicons name="information-circle-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textPrimary }]}>No results to display</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                {currentDataset ? 'Run a SQL query to see results here' : 'Upload a dataset first to run queries'}
              </Text>
            </View>
          )}
        </Card>

        {/* Saved Queries */}
        <Card style={styles.savedQueriesCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Sample Queries</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.queriesScroll}>
            <View style={styles.queryChipsContainer}>
              <TouchableOpacity 
                style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}
                onPress={() => setQuery('SELECT * FROM dataset LIMIT 10;')}
              >
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>Show All Data</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  if (currentDataset && currentDataset.data.length > 0) {
                    const columns = Object.keys(currentDataset.data[0]);
                    setQuery(`SELECT COUNT(*) as total_rows FROM dataset;`);
                  }
                }}
              >
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>Count Rows</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  if (currentDataset && currentDataset.data.length > 0) {
                    const columns = Object.keys(currentDataset.data[0]);
                    if (columns.length > 0) {
                      setQuery(`SELECT ${columns[0]} FROM dataset ORDER BY ${columns[0]} LIMIT 20;`);
                    }
                  }
                }}
              >
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>Sort Data</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  toolbarCard: {
    marginBottom: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  runButton: {
    flex: 1,
    marginRight: 12,
  },
  toolbarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editorCard: {
    flex: 2,
    marginBottom: 0,
  },
  editorHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  editorLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  editor: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    fontFamily: 'monospace',
    borderWidth: 1,
    minHeight: 200,
  },
  resultsCard: {
    flex: 2,
    marginBottom: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsInfo: {
    fontSize: 14,
  },
  emptyResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
  savedQueriesCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  queriesScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  queryChipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  queryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resultsTable: {
    flex: 1,
    margin: 16,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 40,
    alignItems: 'center',
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    minWidth: 120,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    padding: 12,
    minWidth: 120,
    textAlign: 'center',
  },
});
