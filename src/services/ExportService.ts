import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { errorService, ErrorType } from './ErrorService';

/**
 * Export formats supported by the app
 */
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XLSX = 'xlsx',
  PDF = 'pdf',
  PNG = 'png',
  TXT = 'txt'
}

/**
 * Export options interface
 */
export interface ExportOptions {
  format: ExportFormat;
  filename: string;
  includeHeaders?: boolean;
  includeMetadata?: boolean;
  compression?: boolean;
}

/**
 * Export result interface
 */
export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Data export service for various formats
 */
class DataExportService {
  private readonly EXPORT_DIR = `${FileSystem.documentDirectory}exports/`;

  constructor() {
    this.ensureExportDirectory();
  }

  /**
   * Export data to specified format
   */
  async exportData(
    data: any[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      await this.ensureExportDirectory();
      
      const content = await this.generateContent(data, options);
      const filePath = await this.writeFile(content, options);
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      return {
        success: true,
        filePath,
        fileSize: fileInfo.exists ? fileInfo.size : 0,
      };
    } catch (error) {
      const appError = await errorService.handleError(
        error as Error,
        ErrorType.DATA_PROCESSING,
        { 
          operation: 'export_data',
          format: options.format,
          filename: options.filename,
          dataSize: data.length
        }
      );
      
      return {
        success: false,
        error: appError.error.userMessage,
      };
    }
  }

  /**
   * Export and share data
   */
  async exportAndShare(
    data: any[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const result = await this.exportData(data, options);
      
      if (result.success && result.filePath) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.filePath, {
            mimeType: this.getMimeType(options.format),
            dialogTitle: `Share ${options.filename}`,
          });
        } else {
          throw new Error('Sharing is not available on this device');
        }
      }
      
      return result;
    } catch (error) {
      const appError = await errorService.handleError(
        error as Error,
        ErrorType.DATA_PROCESSING,
        { 
          operation: 'export_and_share',
          format: options.format,
          filename: options.filename
        }
      );
      
      return {
        success: false,
        error: appError.error.userMessage,
      };
    }
  }

  /**
   * Export chart/visualization data
   */
  async exportChart(
    chartData: {
      type: string;
      data: any[];
      config: any;
      title?: string;
    },
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const exportData = {
        chart: {
          type: chartData.type,
          title: chartData.title || 'Chart',
          config: chartData.config,
          exportedAt: new Date().toISOString(),
        },
        data: chartData.data,
        metadata: options.includeMetadata ? {
          exportFormat: options.format,
          dataPoints: chartData.data.length,
          platform: Platform.OS,
          version: '1.2.0',
        } : undefined,
      };

      return await this.exportData([exportData], options);
    } catch (error) {
      const appError = await errorService.handleError(
        error as Error,
        ErrorType.DATA_PROCESSING,
        { 
          operation: 'export_chart',
          chartType: chartData.type,
          format: options.format
        }
      );
      
      return {
        success: false,
        error: appError.error.userMessage,
      };
    }
  }

  /**
   * Export dashboard summary
   */
  async exportDashboard(
    dashboard: {
      title: string;
      charts: any[];
      insights?: string[];
      metadata?: any;
    },
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const dashboardData = {
        dashboard: {
          title: dashboard.title,
          exportedAt: new Date().toISOString(),
          chartsCount: dashboard.charts.length,
        },
        charts: dashboard.charts,
        insights: dashboard.insights || [],
        metadata: options.includeMetadata ? {
          ...dashboard.metadata,
          exportFormat: options.format,
          platform: Platform.OS,
          version: '1.2.0',
        } : undefined,
      };

      return await this.exportData([dashboardData], options);
    } catch (error) {
      const appError = await errorService.handleError(
        error as Error,
        ErrorType.DATA_PROCESSING,
        { 
          operation: 'export_dashboard',
          format: options.format,
          chartsCount: dashboard.charts.length
        }
      );
      
      return {
        success: false,
        error: appError.error.userMessage,
      };
    }
  }

  /**
   * Get available export formats for the current platform
   */
  getAvailableFormats(): ExportFormat[] {
    const baseFormats = [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.TXT];
    
    if (Platform.OS === 'web') {
      return [...baseFormats, ExportFormat.XLSX, ExportFormat.PDF, ExportFormat.PNG];
    }
    
    return baseFormats;
  }

  /**
   * Get exported files list
   */
  async getExportedFiles(): Promise<string[]> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.EXPORT_DIR);
      if (!dirInfo.exists) {
        return [];
      }
      
      return await FileSystem.readDirectoryAsync(this.EXPORT_DIR);
    } catch (error) {
      console.error('Error reading exported files:', error);
      return [];
    }
  }

  /**
   * Delete exported file
   */
  async deleteExportedFile(filename: string): Promise<boolean> {
    try {
      const filePath = `${this.EXPORT_DIR}${filename}`;
      await FileSystem.deleteAsync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting exported file:', error);
      return false;
    }
  }

  /**
   * Clear all exported files
   */
  async clearExportedFiles(): Promise<boolean> {
    try {
      const files = await this.getExportedFiles();
      await Promise.all(
        files.map(file => this.deleteExportedFile(file))
      );
      return true;
    } catch (error) {
      console.error('Error clearing exported files:', error);
      return false;
    }
  }

  /**
   * Generate content based on format
   */
  private async generateContent(data: any[], options: ExportOptions): Promise<string> {
    switch (options.format) {
      case ExportFormat.JSON:
        return this.generateJSON(data, options);
      case ExportFormat.CSV:
        return this.generateCSV(data, options);
      case ExportFormat.TXT:
        return this.generateTXT(data, options);
      default:
        throw new Error(`Export format ${options.format} is not supported on this platform`);
    }
  }

  /**
   * Generate JSON content
   */
  private generateJSON(data: any[], options: ExportOptions): string {
    const exportData = {
      exportInfo: options.includeMetadata ? {
        format: options.format,
        filename: options.filename,
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        platform: Platform.OS,
        version: '1.2.0',
      } : undefined,
      data,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate CSV content
   */
  private generateCSV(data: any[], options: ExportOptions): string {
    if (data.length === 0) {
      return '';
    }

    const firstItem = data[0];
    const headers = Object.keys(firstItem);
    
    let csv = '';
    
    // Add headers
    if (options.includeHeaders !== false) {
      csv += headers.join(',') + '\n';
    }
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Handle strings with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  }

  /**
   * Generate TXT content
   */
  private generateTXT(data: any[], options: ExportOptions): string {
    let txt = '';
    
    if (options.includeMetadata) {
      txt += `SoroOne Data Export\n`;
      txt += `Exported: ${new Date().toISOString()}\n`;
      txt += `Format: ${options.format}\n`;
      txt += `Records: ${data.length}\n`;
      txt += `\n${'='.repeat(50)}\n\n`;
    }

    data.forEach((item, index) => {
      txt += `Record ${index + 1}:\n`;
      if (typeof item === 'object') {
        Object.entries(item).forEach(([key, value]) => {
          txt += `  ${key}: ${value}\n`;
        });
      } else {
        txt += `  ${item}\n`;
      }
      txt += '\n';
    });

    return txt;
  }

  /**
   * Write content to file
   */
  private async writeFile(content: string, options: ExportOptions): Promise<string> {
    const filename = this.sanitizeFilename(options.filename);
    const filePath = `${this.EXPORT_DIR}${filename}.${options.format}`;
    
    await FileSystem.writeAsStringAsync(filePath, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return filePath;
  }

  /**
   * Ensure export directory exists
   */
  private async ensureExportDirectory(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.EXPORT_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.EXPORT_DIR, { intermediates: true });
    }
  }

  /**
   * Sanitize filename for file system compatibility
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50); // Limit length
  }

  /**
   * Get MIME type for export format
   */
  private getMimeType(format: ExportFormat): string {
    switch (format) {
      case ExportFormat.JSON:
        return 'application/json';
      case ExportFormat.CSV:
        return 'text/csv';
      case ExportFormat.XLSX:
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case ExportFormat.PDF:
        return 'application/pdf';
      case ExportFormat.PNG:
        return 'image/png';
      case ExportFormat.TXT:
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
}

// Export singleton instance
export const exportService = new DataExportService();

// Helper functions for common export scenarios
export const exportDataAsJSON = (data: any[], filename: string) =>
  exportService.exportData(data, { format: ExportFormat.JSON, filename });

export const exportDataAsCSV = (data: any[], filename: string, includeHeaders = true) =>
  exportService.exportData(data, { 
    format: ExportFormat.CSV, 
    filename, 
    includeHeaders 
  });

export const shareDataAsJSON = (data: any[], filename: string) =>
  exportService.exportAndShare(data, { format: ExportFormat.JSON, filename });

export const shareDataAsCSV = (data: any[], filename: string, includeHeaders = true) =>
  exportService.exportAndShare(data, { 
    format: ExportFormat.CSV, 
    filename, 
    includeHeaders 
  });