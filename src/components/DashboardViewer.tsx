import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { Chart } from './Chart';
import type { Dashboard } from '../types';

interface DashboardViewerProps {
  visible: boolean;
  dashboard: Dashboard | null;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const DashboardViewer: React.FC<DashboardViewerProps> = ({
  visible,
  dashboard,
  onClose,
}) => {
  const { theme } = useTheme();

  if (!dashboard) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                {dashboard.name}
              </Text>
              {dashboard.description && (
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {dashboard.description}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerStats}>
            <View style={styles.stat}>
              <Ionicons name="bar-chart-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {dashboard.charts.length} charts
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name={dashboard.isShared ? "people-outline" : "lock-closed-outline"} size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                {dashboard.isShared ? 'Shared' : 'Private'}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {dashboard.charts.length > 0 ? (
            <View style={styles.chartsGrid}>
              {dashboard.charts.map((chart, index) => (
                <View key={chart.id} style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.chartHeader}>
                    <Text style={[styles.chartTitle, { color: theme.colors.textPrimary }]}>
                      {chart.title}
                    </Text>
                    <View style={styles.chartType}>
                      <Ionicons 
                        name={chart.type === 'bar' ? 'bar-chart-outline' : chart.type === 'line' ? 'trending-up-outline' : 'pie-chart-outline'} 
                        size={16} 
                        color={theme.colors.textSecondary} 
                      />
                      <Text style={[styles.chartTypeText, { color: theme.colors.textSecondary }]}>
                        {chart.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Chart Component */}
                  <View style={styles.chartContent}>
                    <Chart
                      type={chart.type}
                      data={{
                        labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4'],
                        values: [30, 45, 25, 60],
                        colors: chart.styling.colors
                      }}
                      height={200}
                    />
                  </View>
                  
                  <View style={styles.chartInfo}>
                    <Text style={[styles.chartDetails, { color: theme.colors.textSecondary }]}>
                      X-Axis: {chart.xColumn} • Y-Axis: {chart.yColumn}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                No Charts
              </Text>
              <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                This dashboard doesn't have any charts yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  chartsGrid: {
    gap: 20,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  chartType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chartTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  chartInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  chartDetails: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
