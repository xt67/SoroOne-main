/**
 * Core data types for Dashly app
 */

export interface ImportedDataset {
  id: string;
  name: string;
  type: 'excel' | 'csv' | 'sql';
  filePath: string;
  data: Record<string, any>[];
  headers: string[];
  rowCount: number;
  columnCount: number;
  createdAt: Date;
  fileSize: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'excel' | 'csv' | 'sql' | 'database';
  filePath?: string;
  connectionString?: string;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  rowCount: number;
  columnCount: number;
}

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable: boolean;
  unique: boolean;
  samples: any[];
}

export interface Dataset {
  id: string;
  sourceId: string;
  name: string;
  description?: string;
  columns: DataColumn[];
  data: Record<string, any>[];
  metadata: {
    rowCount: number;
    columnCount: number;
    dataTypes: Record<string, string>;
    missingValues: Record<string, number>;
  };
}

export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'scatter' 
  | 'area' 
  | 'histogram' 
  | 'boxplot' 
  | 'heatmap' 
  | 'treemap' 
  | 'bubble' 
  | 'donut'
  | 'waterfall'
  | 'funnel'
  | 'radar';

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  datasetId: string;
  xColumn: string;
  yColumn: string;
  colorColumn?: string;
  sizeColumn?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  filters?: Filter[];
  styling: {
    colors: string[];
    theme: 'light' | 'dark';
    showLegend: boolean;
    showGrid: boolean;
  };
}

export interface Filter {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: ChartConfig[];
  layout: LayoutItem[];
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface LayoutItem {
  chartId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SQLQuery {
  id: string;
  name: string;
  query: string;
  datasetId: string;
  createdAt: Date;
  executionTime?: number;
  resultCount?: number;
  isFavorite: boolean;
}

export interface AIInsight {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  datasetId: string;
  chartRecommendations: ChartType[];
  createdAt: Date;
  isBookmarked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  subscription: 'free' | 'pro' | 'enterprise';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultChartColors: string[];
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    insights: boolean;
    sharing: boolean;
    updates: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    localProcessing: boolean;
  };
}

export interface NavigationParamList extends Record<string, object | undefined> {
  Home: undefined;
  DataInput: undefined;
  SQLEditor: { queryId?: string };
  AIInsights: { datasetId?: string };
  Settings: undefined;
  ChartDetail: { chartId: string };
  DataPreview: { datasetId: string };
}

export interface AppState {
  user: User | null;
  dataSources: DataSource[];
  datasets: Dataset[];
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  sqlQueries: SQLQuery[];
  aiInsights: AIInsight[];
  isLoading: boolean;
  error: string | null;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
