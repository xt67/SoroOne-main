import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DashboardViewer } from '../components/DashboardViewer';
import { dataService } from '../services/DataService';
import { useTheme } from '../styles/ThemeProvider';
import type { Dataset, DataSource, Dashboard, NavigationParamList } from '../types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type HomeNavigationProp = BottomTabNavigationProp<NavigationParamList, 'Home'>;

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeNavigationProp>();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [showDashboardViewer, setShowDashboardViewer] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('DashboardScreen: Loading dashboard data...');
      await dataService.initialize();
      const sources = await dataService.getDataSources();
      const datasetList = await dataService.getDatasets();
      const dashboardList = await dataService.getDashboards();
      setDataSources(sources);
      setDatasets(datasetList);
      setDashboards(dashboardList);
      console.log('DashboardScreen: Dashboard data loaded successfully:', { 
        sources: sources.length, 
        datasets: datasetList.length, 
        dashboards: dashboardList.length 
      });
      
      // Debug: Log dashboard details
      if (dashboardList.length > 0) {
        console.log('DashboardScreen: Dashboard details:', dashboardList.map(d => ({
          id: d.id,
          name: d.name,
          chartsCount: d.charts.length
        })));
      }
    } catch (error) {
      console.error('DashboardScreen: Failed to load dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const navigateToDataInput = () => {
    navigation.navigate('DataInput' as any);
  };

  const navigateToAIInsights = () => {
    navigation.navigate('AIInsights' as any);
  };

  const createSampleDashboard = async () => {
    if (dataSources.length === 0) {
      Alert.alert('No Data Available', 'Please upload some data first to create a dashboard.');
      return;
    }

    try {
      const now = new Date();
      const sampleDashboard: Dashboard = {
        id: `dashboard_${Date.now()}`,
        name: `Dashboard for ${dataSources[0].name}`,
        description: 'Auto-generated dashboard from uploaded data',
        charts: [
          {
            id: 'chart_1',
            type: 'bar',
            title: 'Data Overview',
            datasetId: dataSources[0].id, // Use the first data source as dataset reference
            xColumn: 'Column1', // Placeholder - would be dynamic based on actual data
            yColumn: 'Column2', // Placeholder - would be dynamic based on actual data
            styling: {
              colors: ['#2563EB', '#10B981', '#F59E0B'],
              theme: 'light',
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
        theme: 'auto'
      };

      await dataService.saveDashboard(sampleDashboard);
      await loadDashboardData();
      Alert.alert('Success', 'Sample dashboard created successfully!');
    } catch (error) {
      console.error('Failed to create sample dashboard:', error);
      Alert.alert('Error', 'Failed to create dashboard: ' + (error as Error).message);
    }
  };

  const viewDashboard = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard);
    setShowDashboardViewer(true);
  };

  const showDashboardCharts = (dashboard: Dashboard) => {
    if (dashboard.charts.length === 0) {
      Alert.alert('No Charts', 'This dashboard has no charts yet.');
      return;
    }

    const chartList = dashboard.charts.map((chart, index) => 
      `${index + 1}. ${chart.title} (${chart.type} chart)`
    ).join('\n');

    Alert.alert(
      `Charts in ${dashboard.name}`,
      chartList,
      [{ text: 'OK' }]
    );
  };

  const editDashboard = (dashboard: Dashboard) => {
    Alert.alert(
      'Edit Dashboard',
      `Editing functionality for "${dashboard.name}" will be available in the next update.`,
      [{ text: 'OK' }]
    );
  };

  const shareDashboard = (dashboard: Dashboard) => {
    Alert.alert(
      'Share Dashboard',
      `Sharing functionality for "${dashboard.name}" will be available in the next update.`,
      [{ text: 'OK' }]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.pageTitle, { color: theme.colors.textPrimary }]}>
          Home
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="document-text-outline" size={24} color="#2563EB" />
          <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
            {dataSources.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Data Sources
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="bar-chart-outline" size={24} color="#10B981" />
          <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
            {dashboards.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Dashboards
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="bulb-outline" size={24} color="#F59E0B" />
          <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
            {datasets.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Datasets
          </Text>
        </View>
      </View>

      {/* Recent Uploaded Data Section */}
      <View style={styles.recentDataSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Recent Uploaded Data
        </Text>
        {dataSources.length > 0 ? (
          dataSources.slice(0, 5).map((source) => (
            <View key={source.id} style={[styles.dataSourceCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.dataSourceHeader}>
                <Ionicons 
                  name={source.type === 'csv' ? 'document-text' : source.type === 'excel' ? 'document' : 'server'} 
                  size={20} 
                  color="#2563EB" 
                />
                <View style={styles.dataSourceInfo}>
                  <Text style={[styles.dataSourceName, { color: theme.colors.textPrimary }]}>
                    {source.name}
                  </Text>
                  <Text style={[styles.dataSourceDetails, { color: theme.colors.textSecondary }]}>
                    {source.rowCount.toLocaleString()} rows • {source.columnCount} columns • {formatFileSize(source.size)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.dataSourceDate, { color: theme.colors.textSecondary }]}>
                {formatDate(source.createdAt)}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="folder-open-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No data uploaded yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
              Start by importing your first dataset
            </Text>
          </View>
        )}
      </View>

      {/* Dashboards Section */}
      <View style={styles.dashboardsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            My Dashboards
          </Text>
          {dataSources.length > 0 && (
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
              onPress={createSampleDashboard}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {dashboards.length > 0 ? (
          dashboards.map((dashboard) => (
            <View key={dashboard.id} style={[styles.dashboardCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.dashboardHeader}>
                <Ionicons name="grid-outline" size={24} color="#8B5CF6" />
                <View style={styles.dashboardInfo}>
                  <Text style={[styles.dashboardName, { color: theme.colors.textPrimary }]}>
                    {dashboard.name}
                  </Text>
                  {dashboard.description && (
                    <Text style={[styles.dashboardDescription, { color: theme.colors.textSecondary }]}>
                      {dashboard.description}
                    </Text>
                  )}
                  <Text style={[styles.dashboardDetails, { color: theme.colors.textSecondary }]}>
                    {dashboard.charts.length} charts • {dashboard.isShared ? 'Shared' : 'Private'}
                  </Text>
                </View>
              </View>
              <View style={styles.dashboardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => viewDashboard(dashboard)}>
                  <Ionicons name="eye-outline" size={20} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => editDashboard(dashboard)}>
                  <Ionicons name="create-outline" size={20} color="#10B981" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => shareDashboard(dashboard)}>
                  <Ionicons name="share-outline" size={20} color="#F59E0B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="grid-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
              No dashboards created yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
              Create your first dashboard from uploaded data
            </Text>
            {dataSources.length > 0 && (
              <TouchableOpacity 
                style={[styles.emptyActionButton, { backgroundColor: theme.colors.primary }]}
                onPress={createSampleDashboard}
              >
                <Text style={styles.emptyActionButtonText}>Create Dashboard</Text>
              </TouchableOpacity>
            )}
            
            {/* Debug: Create test dashboard button */}
            <TouchableOpacity 
              style={[styles.emptyActionButton, { backgroundColor: '#8B5CF6', marginTop: 12 }]}
              onPress={() => {
                const testDashboard: Dashboard = {
                  id: `test_dashboard_${Date.now()}`,
                  name: 'Test Dashboard',
                  description: 'This is a test dashboard for debugging',
                  charts: [
                    {
                      id: 'test_chart_1',
                      type: 'bar',
                      title: 'Sample Chart',
                      datasetId: 'test_dataset',
                      xColumn: 'Category',
                      yColumn: 'Value',
                      styling: {
                        colors: ['#2563EB', '#10B981', '#F59E0B'],
                        theme: 'light',
                        showLegend: true,
                        showGrid: true
                      }
                    }
                  ],
                  layout: [{ chartId: 'test_chart_1', x: 0, y: 0, width: 2, height: 1 }],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  isShared: false,
                  theme: 'auto'
                };
                setSelectedDashboard(testDashboard);
                setShowDashboardViewer(true);
              }}
            >
              <Text style={styles.emptyActionButtonText}>Test Dashboard Viewer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
          onPress={navigateToDataInput}
        >
          <Ionicons name="cloud-upload-outline" size={32} color="#2563EB" />
          <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>
            Import Data
          </Text>
          <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
            Upload Excel, CSV, or SQL files to get started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
          onPress={navigateToAIInsights}
        >
          <Ionicons name="analytics-outline" size={32} color="#8B5CF6" />
          <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>
            AI Insights
          </Text>
          <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
            Get intelligent recommendations for your data
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Viewer Modal */}
      <DashboardViewer
        visible={showDashboardViewer}
        dashboard={selectedDashboard}
        onClose={() => {
          setShowDashboardViewer(false);
          setSelectedDashboard(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  recentDataSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  dataSourceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dataSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dataSourceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dataSourceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dataSourceDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  dataSourceDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  actionCard: {
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
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  dashboardsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dashboardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dashboardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dashboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dashboardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dashboardDetails: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dashboardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  emptyActionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
