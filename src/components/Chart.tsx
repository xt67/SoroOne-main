import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../styles/ThemeProvider';
import type { ChartType, ChartData } from '../types';

const screenWidth = Dimensions.get('window').width;

interface ChartProps {
  type: ChartType;
  data: ChartData;
  title?: string;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ 
  type, 
  data, 
  title, 
  height = 220 
}) => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={{
              labels: data.labels,
              datasets: [{
                data: data.values,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                strokeWidth: 2,
              }],
            }}
            width={screenWidth - 40}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      
      case 'bar':
        return (
          <BarChart
            data={{
              labels: data.labels,
              datasets: [{
                data: data.values,
              }],
            }}
            width={screenWidth - 40}
            height={height}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        );
      
      case 'pie':
        return (
          <PieChart
            data={data.labels.map((label: string, index: number) => ({
              name: label,
              population: data.values[index],
              color: theme.colors.chart[index % theme.colors.chart.length],
              legendFontColor: theme.colors.textPrimary,
              legendFontSize: 12,
            }))}
            width={screenWidth - 40}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        );
      
      default:
        return (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              Unsupported chart type: {type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {title && (
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
      )}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  errorContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Chart;
