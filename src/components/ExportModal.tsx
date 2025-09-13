import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../styles/useTheme';
import { ExportFormat, ExportOptions, exportService } from '../services/ExportService';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  data: any[];
  title?: string;
  type?: 'data' | 'chart' | 'dashboard';
  chartData?: {
    type: string;
    data: any[];
    config: any;
    title?: string;
  };
  dashboardData?: {
    title: string;
    charts: any[];
    insights?: string[];
    metadata?: any;
  };
}

/**
 * Modal component for data export functionality
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  data,
  title = 'Export Data',
  type = 'data',
  chartData,
  dashboardData,
}) => {
  const { theme } = useTheme();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.JSON);
  const [filename, setFilename] = useState('export_' + new Date().toISOString().slice(0, 10));
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const availableFormats = exportService.getAvailableFormats();

  const handleExport = async () => {
    if (!filename.trim()) {
      Alert.alert('Error', 'Please enter a filename');
      return;
    }

    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        filename: filename.trim(),
        includeHeaders,
        includeMetadata,
      };

      let result;
      
      switch (type) {
        case 'chart':
          if (chartData) {
            result = await exportService.exportChart(chartData, options);
          } else {
            throw new Error('Chart data is required for chart export');
          }
          break;
        case 'dashboard':
          if (dashboardData) {
            result = await exportService.exportDashboard(dashboardData, options);
          } else {
            throw new Error('Dashboard data is required for dashboard export');
          }
          break;
        default:
          result = await exportService.exportData(data, options);
          break;
      }

      if (result.success) {
        Alert.alert(
          'Export Successful',
          `Data exported successfully!\nFile: ${filename}.${selectedFormat}\nSize: ${result.fileSize ? Math.round(result.fileSize / 1024) : 0}KB`,
          [
            {
              text: 'Share',
              onPress: () => handleShare(),
            },
            { text: 'OK', onPress: onClose },
          ]
        );
      } else {
        Alert.alert('Export Failed', result.error || 'Unknown error occurred');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Export Failed', `Error: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format: selectedFormat,
        filename: filename.trim(),
        includeHeaders,
        includeMetadata,
      };

      let result;
      
      switch (type) {
        case 'chart':
          if (chartData) {
            result = await exportService.exportChart(chartData, options);
            if (result.success && result.filePath) {
              await exportService.exportAndShare([], options);
            }
          }
          break;
        case 'dashboard':
          if (dashboardData) {
            result = await exportService.exportDashboard(dashboardData, options);
            if (result.success && result.filePath) {
              await exportService.exportAndShare([], options);
            }
          }
          break;
        default:
          result = await exportService.exportAndShare(data, options);
          break;
      }

      if (result && result.success) {
        onClose();
      } else {
        Alert.alert('Share Failed', result?.error || 'Unable to share file');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Share Failed', `Error: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat): string => {
    switch (format) {
      case ExportFormat.JSON:
        return '📄';
      case ExportFormat.CSV:
        return '📊';
      case ExportFormat.XLSX:
        return '📗';
      case ExportFormat.PDF:
        return '📕';
      case ExportFormat.PNG:
        return '🖼️';
      case ExportFormat.TXT:
        return '📝';
      default:
        return '📁';
    }
  };

  const getFormatDescription = (format: ExportFormat): string => {
    switch (format) {
      case ExportFormat.JSON:
        return 'Structured data format, ideal for developers';
      case ExportFormat.CSV:
        return 'Spreadsheet compatible, works with Excel';
      case ExportFormat.XLSX:
        return 'Native Excel format with formatting';
      case ExportFormat.PDF:
        return 'Portable document, print-ready';
      case ExportFormat.PNG:
        return 'Image format for charts and visuals';
      case ExportFormat.TXT:
        return 'Plain text, universal compatibility';
      default:
        return 'Standard data format';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.colors.primary }]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Data Info */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Export Information
            </Text>
            <Text style={[styles.dataInfo, { color: theme.colors.textSecondary }]}>
              {type === 'chart' && chartData
                ? `Chart: ${chartData.title || chartData.type} (${chartData.data.length} data points)`
                : type === 'dashboard' && dashboardData
                ? `Dashboard: ${dashboardData.title} (${dashboardData.charts.length} charts)`
                : `Dataset: ${data.length} records`}
            </Text>
          </View>

          {/* Format Selection */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Export Format
            </Text>
            {availableFormats.map((format) => (
              <TouchableOpacity
                key={format}
                style={[
                  styles.formatOption,
                  selectedFormat === format && { backgroundColor: theme.colors.surface },
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => setSelectedFormat(format)}
              >
                <View style={styles.formatHeader}>
                  <Text style={styles.formatIcon}>{getFormatIcon(format)}</Text>
                  <View style={styles.formatInfo}>
                    <Text style={[styles.formatName, { color: theme.colors.textPrimary }]}>
                      {format.toUpperCase()}
                    </Text>
                    <Text style={[styles.formatDescription, { color: theme.colors.textSecondary }]}>
                      {getFormatDescription(format)}
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedFormat === format && { backgroundColor: theme.colors.primary },
                    { borderColor: theme.colors.border }
                  ]}>
                    {selectedFormat === format && (
                      <View style={[styles.radioInner, { backgroundColor: theme.colors.background }]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filename */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Filename
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border
                }
              ]}
              value={filename}
              onChangeText={setFilename}
              placeholder="Enter filename"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={[styles.filenamePreview, { color: theme.colors.textSecondary }]}>
              Will be saved as: {filename}.{selectedFormat}
            </Text>
          </View>

          {/* Options */}
          <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Options
            </Text>
            
            {selectedFormat === ExportFormat.CSV && (
              <View style={styles.option}>
                <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>
                  Include Headers
                </Text>
                <Switch
                  value={includeHeaders}
                  onValueChange={setIncludeHeaders}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            )}

            <View style={styles.option}>
              <Text style={[styles.optionLabel, { color: theme.colors.textPrimary }]}>
                Include Metadata
              </Text>
              <Switch
                value={includeMetadata}
                onValueChange={setIncludeMetadata}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleShare}
            disabled={isExporting}
          >
            <Text style={[styles.shareButtonText, { color: theme.colors.primary }]}>
              Share
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={theme.colors.background} size="small" />
            ) : (
              <Text style={[styles.exportButtonText, { color: theme.colors.background }]}>
                Export
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dataInfo: {
    fontSize: 14,
    lineHeight: 20,
  },
  formatOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 8,
  },
  filenamePreview: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    borderWidth: 1,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exportButton: {},
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExportModal;