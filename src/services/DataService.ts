/**
 * Data service for managing data sources, storage, and retrieval
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { DataSource, Dataset, Dashboard, SQLQuery, AIInsight } from '../types';

const DB_NAME = 'dataviz_analytics.db';

class DataService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize the database and create tables
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Create necessary database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createTableQueries = [
      `
        CREATE TABLE IF NOT EXISTS data_sources (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          file_path TEXT,
          connection_string TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          size INTEGER NOT NULL,
          row_count INTEGER NOT NULL,
          column_count INTEGER NOT NULL
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS datasets (
          id TEXT PRIMARY KEY,
          source_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          metadata TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          FOREIGN KEY (source_id) REFERENCES data_sources (id)
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS dashboards (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          charts TEXT NOT NULL,
          layout TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          is_shared INTEGER DEFAULT 0,
          theme TEXT DEFAULT 'auto'
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS sql_queries (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          query TEXT NOT NULL,
          dataset_id TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          execution_time INTEGER,
          result_count INTEGER,
          is_favorite INTEGER DEFAULT 0,
          FOREIGN KEY (dataset_id) REFERENCES datasets (id)
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS ai_insights (
          id TEXT PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          confidence REAL NOT NULL,
          dataset_id TEXT NOT NULL,
          chart_recommendations TEXT,
          created_at INTEGER NOT NULL,
          is_bookmarked INTEGER DEFAULT 0,
          FOREIGN KEY (dataset_id) REFERENCES datasets (id)
        )
      `,
    ];

    for (const query of createTableQueries) {
      await this.db.execAsync(query);
    }
  }

  /**
   * Save a data source to the database
   */
  async saveDataSource(dataSource: DataSource): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      console.log('DataService: Saving data source:', dataSource.id, dataSource.name);
      
      await this.db.runAsync(
        `
          INSERT OR REPLACE INTO data_sources 
          (id, name, type, file_path, connection_string, created_at, updated_at, size, row_count, column_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          dataSource.id,
          dataSource.name,
          dataSource.type,
          dataSource.filePath || '',
          dataSource.connectionString || '',
          dataSource.createdAt.getTime(),
          dataSource.updatedAt.getTime(),
          dataSource.size,
          dataSource.rowCount,
          dataSource.columnCount,
        ]
      );
      
      console.log('DataService: Data source saved successfully');
    } catch (error) {
      console.error('DataService: Failed to save data source:', error);
      throw error;
    }
  }

  /**
   * Get all data sources
   */
  async getDataSources(): Promise<DataSource[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM data_sources ORDER BY created_at DESC');
    
    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      filePath: row.file_path || undefined,
      connectionString: row.connection_string || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      size: row.size,
      rowCount: row.row_count,
      columnCount: row.column_count,
    }));
  }

  /**
   * Save a dataset
   */
  async saveDataset(dataset: Dataset): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      console.log('DataService: Saving dataset:', dataset.id, dataset.name);
      console.log('DataService: Dataset data length:', dataset.data.length);
      
      await this.db.runAsync(
        `
          INSERT OR REPLACE INTO datasets 
          (id, source_id, name, description, metadata, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          dataset.id,
          dataset.sourceId,
          dataset.name,
          dataset.description || '',
          JSON.stringify(dataset.metadata),
          Date.now(),
        ]
      );

      // Store the actual data in AsyncStorage for larger datasets
      console.log('DataService: Storing dataset data in AsyncStorage...');
      await AsyncStorage.setItem(`dataset_data_${dataset.id}`, JSON.stringify(dataset.data));
      console.log('DataService: Dataset saved successfully');
    } catch (error) {
      console.error('DataService: Failed to save dataset:', error);
      throw error;
    }
  }

  /**
   * Get a dataset by ID
   */
  async getDataset(id: string): Promise<Dataset | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync('SELECT * FROM datasets WHERE id = ?', [id]);
    
    if (!result) return null;

    const row = result as any;
    const data = await AsyncStorage.getItem(`dataset_data_${id}`);
    
    return {
      id: row.id,
      sourceId: row.source_id,
      name: row.name,
      description: row.description || undefined,
      columns: [], // Would be derived from metadata
      data: data ? JSON.parse(data) : [],
      metadata: JSON.parse(row.metadata),
    };
  }

  /**
   * Get all datasets
   */
  async getDatasets(): Promise<Dataset[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getAllAsync('SELECT * FROM datasets ORDER BY created_at DESC');
      
      const datasets: Dataset[] = [];
      for (const row of result) {
        const rowData = row as any;
        const data = await AsyncStorage.getItem(`dataset_data_${rowData.id}`);
        
        datasets.push({
          id: rowData.id,
          sourceId: rowData.source_id,
          name: rowData.name,
          description: rowData.description || undefined,
          columns: [], // Would be derived from metadata
          data: data ? JSON.parse(data) : [],
          metadata: JSON.parse(rowData.metadata),
        });
      }
      
      return datasets;
    } catch (error) {
      console.error('DataService: Failed to get datasets:', error);
      return [];
    }
  }

  /**
   * Save a dashboard
   */
  async saveDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `
        INSERT OR REPLACE INTO dashboards 
        (id, name, description, charts, layout, created_at, updated_at, is_shared, theme)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        dashboard.id,
        dashboard.name,
        dashboard.description || '',
        JSON.stringify(dashboard.charts),
        JSON.stringify(dashboard.layout),
        dashboard.createdAt.getTime(),
        dashboard.updatedAt.getTime(),
        dashboard.isShared ? 1 : 0,
        dashboard.theme,
      ]
    );
  }

  /**
   * Get all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM dashboards ORDER BY updated_at DESC');
    
    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      charts: JSON.parse(row.charts),
      layout: JSON.parse(row.layout),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      isShared: row.is_shared === 1,
      theme: row.theme,
    }));
  }

  /**
   * Save an SQL query
   */
  async saveSQLQuery(query: SQLQuery): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `
        INSERT OR REPLACE INTO sql_queries 
        (id, name, query, dataset_id, created_at, execution_time, result_count, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        query.id,
        query.name,
        query.query,
        query.datasetId,
        query.createdAt.getTime(),
        query.executionTime || null,
        query.resultCount || null,
        query.isFavorite ? 1 : 0,
      ]
    );
  }

  /**
   * Get saved SQL queries
   */
  async getSQLQueries(): Promise<SQLQuery[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM sql_queries ORDER BY created_at DESC');
    
    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      query: row.query,
      datasetId: row.dataset_id,
      createdAt: new Date(row.created_at),
      executionTime: row.execution_time || undefined,
      resultCount: row.result_count || undefined,
      isFavorite: row.is_favorite === 1,
    }));
  }

  /**
   * Save an AI insight
   */
  async saveAIInsight(insight: AIInsight): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `
        INSERT OR REPLACE INTO ai_insights 
        (id, question, answer, confidence, dataset_id, chart_recommendations, created_at, is_bookmarked)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        insight.id,
        insight.question,
        insight.answer,
        insight.confidence,
        insight.datasetId,
        JSON.stringify(insight.chartRecommendations),
        insight.createdAt.getTime(),
        insight.isBookmarked ? 1 : 0,
      ]
    );
  }

  /**
   * Get AI insights
   */
  async getAIInsights(): Promise<AIInsight[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM ai_insights ORDER BY created_at DESC');
    
    return result.map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      confidence: row.confidence,
      datasetId: row.dataset_id,
      chartRecommendations: JSON.parse(row.chart_recommendations),
      createdAt: new Date(row.created_at),
      isBookmarked: row.is_bookmarked === 1,
    }));
  }

  /**
   * Clear all app data (for privacy/reset purposes)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = ['data_sources', 'datasets', 'dashboards', 'sql_queries', 'ai_insights'];
    
    for (const table of tables) {
      await this.db.runAsync(`DELETE FROM ${table}`);
    }

    // Clear AsyncStorage data
    const keys = await AsyncStorage.getAllKeys();
    const datasetKeys = keys.filter(key => key.startsWith('dataset_data_'));
    await AsyncStorage.multiRemove(datasetKeys);
  }
}

export const dataService = new DataService();
export { DataService };
