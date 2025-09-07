import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { colorSchemes, ColorScheme } from '../styles/theme';

interface ColorSchemeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ColorSchemeModal: React.FC<ColorSchemeModalProps> = ({ visible, onClose }) => {
  const { theme, colorScheme, setColorScheme } = useTheme();

  const handleColorSchemeSelect = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    onClose();
  };

  const renderColorPreview = (scheme: ColorScheme) => {
    const schemeData = colorSchemes[scheme];
    const colors = schemeData.light; // Preview using light colors for consistency
    
    return (
      <View style={styles.colorPreview}>
        <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.colorDot, { backgroundColor: colors.secondary }]} />
        <View style={[styles.colorDot, { backgroundColor: colors.accent }]} />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Choose Color Scheme
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Select a color scheme to customize the appearance of charts and interface elements.
          </Text>

          <View style={styles.schemeGrid}>
            {(Object.keys(colorSchemes) as ColorScheme[]).map((scheme) => {
              const schemeData = colorSchemes[scheme];
              const isSelected = colorScheme === scheme;

              return (
                <TouchableOpacity
                  key={scheme}
                  style={[
                    styles.schemeCard,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }
                  ]}
                  onPress={() => handleColorSchemeSelect(scheme)}
                >
                  <View style={styles.schemeHeader}>
                    <Text style={[styles.schemeName, { color: theme.colors.textPrimary }]}>
                      {schemeData.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                    )}
                  </View>
                  
                  {renderColorPreview(scheme)}
                  
                  <View style={styles.chartPreview}>
                    {schemeData.light.chart.slice(0, 4).map((color, index) => (
                      <View 
                        key={index}
                        style={[
                          styles.chartBar,
                          { 
                            backgroundColor: color,
                            height: 20 + (index * 8),
                          }
                        ]} 
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  schemeGrid: {
    gap: 16,
  },
  schemeCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chartPreview: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 48,
  },
  chartBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 8,
  },
});
