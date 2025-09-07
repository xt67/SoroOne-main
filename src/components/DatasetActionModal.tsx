import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import type { ImportedDataset } from '../types';

interface DatasetActionModalProps {
  visible: boolean;
  dataset: ImportedDataset | null;
  onClose: () => void;
  onCreateDashboard: () => void;
  onGetAIInsights: () => void;
  onEditWithSQL: () => void;
}

export const DatasetActionModal: React.FC<DatasetActionModalProps> = ({
  visible,
  dataset,
  onClose,
  onCreateDashboard,
  onGetAIInsights,
  onEditWithSQL,
}) => {
  const { theme } = useTheme();

  if (!dataset) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Dataset Imported Successfully!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {dataset.name}
            </Text>
            <Text style={[styles.details, { color: theme.colors.textSecondary }]}>
              {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} columns
            </Text>
          </View>

          <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>
            What would you like to do next?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction, { backgroundColor: theme.colors.primary }]}
              onPress={onCreateDashboard}
            >
              <Ionicons name="grid-outline" size={24} color="white" />
              <View style={styles.actionContent}>
                <Text style={styles.actionButtonText}>Create Dashboard</Text>
                <Text style={styles.actionDescription}>
                  Generate interactive charts and visualizations
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
              onPress={onGetAIInsights}
            >
              <Ionicons name="bulb-outline" size={24} color="white" />
              <View style={styles.actionContent}>
                <Text style={styles.actionButtonText}>Get AI Insights</Text>
                <Text style={styles.actionDescription}>
                  Discover patterns and trends in your data
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={onEditWithSQL}
            >
              <Ionicons name="code-outline" size={24} color="white" />
              <View style={styles.actionContent}>
                <Text style={styles.actionButtonText}>Edit using SQL Query Editor</Text>
                <Text style={styles.actionDescription}>
                  Write custom queries to analyze your data
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.closeButton, { borderColor: theme.colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  primaryAction: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionContent: {
    flex: 1,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
