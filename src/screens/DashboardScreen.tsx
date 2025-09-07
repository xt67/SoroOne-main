import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DashboardViewer } from '../components/DashboardViewer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
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
            datasetId: dataSources[0].id,
            xColumn: 'Column1',
            yColumn: 'Column2',
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Overview</Text>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#FFFFFF20' }]}>
                    <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
                    {dataSources.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Data Sources
                  </Text>
                </View>
              </Card>
              
              <Card style={styles.statCard}>
                <View style={styles.statContent}>
                  <View style={[styles.statIconContainer, { backgroundColor: '#10B98120' }]}>
                    <Ionicons name="bar-chart-outline" size={24} color="#10B981" />
                  </View>
                  <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>
                    {dashboards.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Dashboards
                  </Text>
                </View>
              </Card>
            </View>
          </View>

          {/* Recent Data Sources */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Recent Data</Text>
              {dataSources.length > 3 && (
                <TouchableOpacity onPress={navigateToDataInput}>
                  <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {dataSources.length > 0 ? (
              <View style={styles.dataSourcesList}>
                {dataSources.slice(0, 3).map((source) => (
                  <Card key={source.id} style={styles.dataSourceCard}>
                    <View style={styles.dataSourceItem}>
                      <View style={styles.dataSourceIcon}>
                        <Ionicons 
                          name={source.type === 'csv' ? 'document-text' : source.type === 'excel' ? 'document' : 'server'} 
                          size={20} 
                          color={theme.colors.primary}
                        />
                      </View>
                      <View style={styles.dataSourceInfo}>
                        <Text style={[styles.dataSourceName, { color: theme.colors.textPrimary }]}>
                          {source.name}
                        </Text>
                        <Text style={[styles.dataSourceMeta, { color: theme.colors.textSecondary }]}>
                          {source.rowCount.toLocaleString()} rows • {source.columnCount} cols
                        </Text>
                        <Text style={[styles.dataSourceDate, { color: theme.colors.textSecondary }]}>
                          {formatDate(source.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Card style={styles.emptyCard}>
                <View style={styles.emptyState}>
                  <Ionicons name="folder-open-outline" size={48} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Data Yet</Text>
                  <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                    Import your first dataset to get started with creating dashboards and insights
                  </Text>
                  <Button
                    title="Import Data"
                    onPress={navigateToDataInput}
                    style={styles.emptyActionButton}
                  />
                </View>
              </Card>
            )}
          </View>

          {/* Dashboards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Dashboards</Text>
              {dataSources.length > 0 && (
                <Button
                  title="Create"
                  onPress={createSampleDashboard}
                  style={styles.createButton}
                  size="small"
                />
              )}
            </View>
            
            {dashboards.length > 0 ? (
              <View style={styles.dashboardsList}>
                {dashboards.map((dashboard) => (
                  <Card key={dashboard.id} style={styles.dashboardCard}>
                    <TouchableOpacity style={styles.dashboardItem} onPress={() => viewDashboard(dashboard)}>
                      <View style={styles.dashboardIcon}>
                        <Ionicons name="grid-outline" size={20} color={theme.colors.primary} />
                      </View>
                      <View style={styles.dashboardInfo}>
                        <Text style={[styles.dashboardName, { color: theme.colors.textPrimary }]}>
                          {dashboard.name}
                        </Text>
                        <Text style={[styles.dashboardMeta, { color: theme.colors.textSecondary }]}>
                          {dashboard.charts.length} charts • {formatDate(dashboard.updatedAt)}
                        </Text>
                        {dashboard.description && (
                          <Text style={[styles.dashboardDescription, { color: theme.colors.textSecondary }]}>
                            {dashboard.description}
                          </Text>
                        )}
                      </View>
                      <View style={styles.dashboardActions}>
                        <TouchableOpacity 
                          style={styles.actionButton} 
                          onPress={(e) => {
                            e.stopPropagation();
                            editDashboard(dashboard);
                          }}
                        >
                          <Ionicons name="create-outline" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButton} 
                          onPress={(e) => {
                            e.stopPropagation();
                            shareDashboard(dashboard);
                          }}
                        >
                          <Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            ) : dataSources.length > 0 ? (
              <Card style={styles.emptyCard}>
                <View style={styles.emptyState}>
                  <Ionicons name="grid-outline" size={48} color={theme.colors.textSecondary} />
                  <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>No Dashboards</Text>
                  <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                    Create your first dashboard to visualize your data
                  </Text>
                  <Button
                    title="Create Dashboard"
                    onPress={createSampleDashboard}
                    style={styles.emptyActionButton}
                  />
                </View>
              </Card>
            ) : null}
          </View>

          {/* Quick Actions */}
          {dataSources.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <Card style={styles.actionCard}>
                  <TouchableOpacity style={styles.actionContent} onPress={navigateToAIInsights}>
                    <View style={[styles.actionIconContainer, { backgroundColor: '#8B5CF620' }]}>
                      <Ionicons name="bulb-outline" size={24} color="#8B5CF6" />
                    </View>
                    <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>AI Insights</Text>
                    <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                      Get smart analysis
                    </Text>
                  </TouchableOpacity>
                </Card>
                
                <Card style={styles.actionCard}>
                  <TouchableOpacity style={styles.actionContent} onPress={navigateToDataInput}>
                    <View style={[styles.actionIconContainer, { backgroundColor: '#F59E0B20' }]}>
                      <Ionicons name="cloud-upload-outline" size={24} color="#F59E0B" />
                    </View>
                    <Text style={[styles.actionTitle, { color: theme.colors.textPrimary }]}>Import More</Text>
                    <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                      Add more datasets
                    </Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {showDashboardViewer && selectedDashboard && (
        <DashboardViewer
          visible={showDashboardViewer}
          dashboard={selectedDashboard}
          onClose={() => setShowDashboardViewer(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dataSourcesList: {
    gap: 12,
  },
  dataSourceCard: {
    marginBottom: 0,
  },
  dataSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dataSourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dataSourceInfo: {
    flex: 1,
  },
  dataSourceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dataSourceMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  dataSourceDate: {
    fontSize: 12,
  },
  dashboardsList: {
    gap: 12,
  },
  dashboardCard: {
    marginBottom: 0,
  },
  dashboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dashboardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dashboardInfo: {
    flex: 1,
  },
  dashboardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dashboardMeta: {
    fontSize: 14,
    marginBottom: 2,
  },
  dashboardDescription: {
    fontSize: 12,
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
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
    marginBottom: 20,
  },
  emptyActionButton: {
    minWidth: 150,
  },
  createButton: {
    paddingHorizontal: 16,
  },
});
