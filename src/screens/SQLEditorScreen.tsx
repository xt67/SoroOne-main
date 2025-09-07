import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SQLEditorScreen() {
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
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarButton} onPress={executeQuery}>
          <Ionicons 
            name={isExecuting ? "hourglass-outline" : "play-outline"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.toolbarButtonText}>
            {isExecuting ? 'Executing...' : 'Run Query'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.toolbarButton, styles.secondaryButton]}>
          <Ionicons name="save-outline" size={20} color="#2563EB" />
          <Text style={[styles.toolbarButtonText, styles.secondaryButtonText]}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.toolbarButton, styles.secondaryButton]}>
          <Ionicons name="folder-outline" size={20} color="#2563EB" />
          <Text style={[styles.toolbarButtonText, styles.secondaryButtonText]}>Open</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        <Text style={styles.editorLabel}>SQL Query Editor</Text>
        <TextInput
          style={styles.editor}
          value={query}
          onChangeText={setQuery}
          multiline
          placeholder="Enter your SQL query here..."
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Query Results</Text>
          <Text style={styles.resultsInfo}>0 rows returned</Text>
        </View>
        
        <View style={styles.emptyResults}>
          <Ionicons name="information-circle-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No results to display</Text>
          <Text style={styles.emptySubtext}>
            Run a query to see results here
          </Text>
        </View>
      </View>

      <View style={styles.savedQueries}>
        <Text style={styles.sectionTitle}>Saved Queries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.queryChip}>
            <Text style={styles.chipText}>Sample Query 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.queryChip}>
            <Text style={styles.chipText}>User Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.queryChip}>
            <Text style={styles.chipText}>Sales Report</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  toolbarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: '#2563EB',
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  editorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  editor: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultsContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultsInfo: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  savedQueries: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  queryChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
});
