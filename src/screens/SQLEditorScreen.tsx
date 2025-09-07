import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../styles/ThemeProvider';

export default function SQLEditorScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('SELECT * FROM table_name LIMIT 10;');
  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = () => {
    setIsExecuting(true);
    // Simulate query execution
    setTimeout(() => {
      setIsExecuting(false);
    }, 2000);
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
            <Text style={[styles.resultsInfo, { color: theme.colors.textSecondary }]}>0 rows returned</Text>
          </View>
          
          <View style={styles.emptyResults}>
            <Ionicons name="information-circle-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textPrimary }]}>No results to display</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Run a query to see results here
            </Text>
          </View>
        </Card>

        {/* Saved Queries */}
        <Card style={styles.savedQueriesCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Saved Queries</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.queriesScroll}>
            <View style={styles.queryChipsContainer}>
              <TouchableOpacity style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>Sample Query 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>User Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.queryChip, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.chipText, { color: theme.colors.textPrimary }]}>Sales Report</Text>
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
});
