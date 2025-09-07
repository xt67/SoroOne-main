import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { Logo } from './Logo';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  const appInfo = {
    version: '1.1.0',
    buildNumber: '2025071401',
    releaseDate: 'July 2025',
    platform: 'React Native (Expo)',
    author: 'Dashly Development Team',
  };

  const features = [
    'Excel, CSV, and SQL file import',
    'Interactive dashboard creation',
    'AI-powered data insights',
    'SQL query editor with syntax highlighting',
    'Multiple color schemes',
    'Light/dark mode support',
    'Data visualization and analytics',
    'Export and sharing capabilities',
  ];

  const acknowledgments = [
    { name: 'React Native', description: 'Mobile app framework' },
    { name: 'Expo', description: 'Development platform' },
    { name: 'PapaParse', description: 'CSV parsing library' },
    { name: 'Ionicons', description: 'Icon library' },
    { name: 'React Navigation', description: 'Navigation library' },
  ];

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
            About Dashly
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* App Logo and Info */}
          <View style={styles.appInfoSection}>
            <Logo size="large" showText={true} />
            <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
              Transform your data into actionable insights on the go! Dashly is a comprehensive mobile application 
              for data visualization, analysis, and intelligent reporting.
            </Text>
          </View>

          {/* Version Information */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Version Information
            </Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Version</Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{appInfo.version}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Build</Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{appInfo.buildNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Release</Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{appInfo.releaseDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Platform</Text>
                <Text style={[styles.infoValue, { color: theme.colors.textPrimary }]}>{appInfo.platform}</Text>
              </View>
            </View>
          </View>

          {/* Key Features */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Key Features
            </Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Contact & Support */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Contact & Support
            </Text>
            
            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={() => openLink('mailto:support@dashly.app')}
            >
              <Ionicons name="mail-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                support@dashly.app
              </Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={() => openLink('https://dashly.app')}
            >
              <Ionicons name="globe-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                dashly.app
              </Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkRow} 
              onPress={() => openLink('https://github.com/dashly/mobile')}
            >
              <Ionicons name="logo-github" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                View on GitHub
              </Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Acknowledgments */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Built With
            </Text>
            {acknowledgments.map((item, index) => (
              <View key={index} style={styles.ackRow}>
                <Text style={[styles.ackName, { color: theme.colors.textPrimary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.ackDescription, { color: theme.colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Legal */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Legal
            </Text>
            
            <TouchableOpacity style={styles.linkRow}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Privacy Policy
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow}>
              <Ionicons name="document-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Terms of Service
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRow}>
              <Ionicons name="shield-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Open Source Licenses
              </Text>
              <Ionicons name="chevron-forward-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Copyright */}
          <View style={styles.copyrightSection}>
            <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
              © 2025 Dashly Development Team
            </Text>
            <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
              All rights reserved
            </Text>
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
  appInfoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  linkText: {
    fontSize: 16,
    flex: 1,
  },
  ackRow: {
    marginBottom: 12,
  },
  ackName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ackDescription: {
    fontSize: 14,
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
