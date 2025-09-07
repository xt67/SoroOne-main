import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { ColorSchemeModal } from '../components/ColorSchemeModal';
import { AboutModal } from '../components/AboutModal';
import { colorSchemes } from '../styles/theme';

export default function SettingsScreen() {
  const { theme, themeMode, isDark, setThemeMode, colorScheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [showColorSchemeModal, setShowColorSchemeModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleThemeToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  const openColorSchemeModal = () => {
    setShowColorSchemeModal(true);
  };

  const closeColorSchemeModal = () => {
    setShowColorSchemeModal(false);
  };

  const openAboutModal = () => {
    setShowAboutModal(true);
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };

  const openHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How would you like to get help?',
      [
        {
          text: 'Email Support',
          onPress: () => openEmailSupport(),
        },
        {
          text: 'Visit Website',
          onPress: () => openWebsite(),
        },
        {
          text: 'View Documentation',
          onPress: () => showDocumentation(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openEmailSupport = async () => {
    try {
      const subject = encodeURIComponent('Dashly App Support Request');
      const body = encodeURIComponent(`Hi Dashly Support Team,

I need help with the following:

[Please describe your issue here]

App Version: 1.1.0
Device: [Your device information]

Thank you!`);
      
      const mailtoUrl = `mailto:support@dashly.app?subject=${subject}&body=${body}`;
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Email Not Available', 'Please email us at support@dashly.app');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open email client. Please email us at support@dashly.app');
    }
  };

  const openWebsite = async () => {
    try {
      const url = 'https://dashly.app/support';
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Could not open website');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open website');
    }
  };

  const showDocumentation = () => {
    Alert.alert(
      'Documentation',
      'Access help topics and guides:',
      [
        {
          text: 'Getting Started',
          onPress: () => Alert.alert('Getting Started', 'Import your first dataset by tapping "Data Input" and selecting a CSV or Excel file. Then create a dashboard to visualize your data!'),
        },
        {
          text: 'Data Import Guide',
          onPress: () => Alert.alert('Data Import', 'Supported formats:\n• CSV files\n• Excel files (.xlsx)\n• SQL query results\n\nTip: Ensure your data has clear column headers for best results.'),
        },
        {
          text: 'Dashboard Creation',
          onPress: () => Alert.alert('Dashboard Creation', 'After importing data:\n1. Tap "Create Dashboard" from the dataset options\n2. Choose chart types that best represent your data\n3. Customize colors using different themes\n4. Share your insights!'),
        },
        {
          text: 'Troubleshooting',
          onPress: () => Alert.alert('Troubleshooting', 'Common issues:\n• File not importing: Check file format and size\n• Charts not showing: Ensure data has numeric columns\n• App performance: Clear cache in settings\n\nStill need help? Contact support!'),
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  const rateApp = () => {
    Alert.alert(
      'Rate Dashly',
      'Thank you for using Dashly! Your feedback helps us improve.',
      [
        {
          text: 'Rate on App Store',
          onPress: () => openAppStore(),
        },
        {
          text: 'Rate on Google Play',
          onPress: () => openGooglePlay(),
        },
        {
          text: 'Send Feedback',
          onPress: () => sendFeedback(),
        },
        {
          text: 'Later',
          style: 'cancel',
        },
      ]
    );
  };

  const openAppStore = async () => {
    try {
      const url = 'https://apps.apple.com/app/dashly/id123456789'; // Replace with actual App Store URL
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open App Store');
    }
  };

  const openGooglePlay = async () => {
    try {
      const url = 'https://play.google.com/store/apps/details?id=com.dashly.app'; // Replace with actual Play Store URL
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Could not open Google Play');
    }
  };

  const sendFeedback = async () => {
    try {
      const subject = encodeURIComponent('Dashly App Feedback');
      const body = encodeURIComponent(`Hi Dashly Team,

Here's my feedback about the app:

[Please share your thoughts, suggestions, or issues]

What I like:
- 

What could be improved:
- 

Rating: ⭐⭐⭐⭐⭐ (out of 5)

App Version: 1.1.0

Thank you for creating this amazing app!`);
      
      const mailtoUrl = `mailto:feedback@dashly.app?subject=${subject}&body=${body}`;
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open email client. Please email us at feedback@dashly.app');
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Switch to dark theme for better viewing in low light
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.surface }]} onPress={openColorSchemeModal}>
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Color Scheme</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {colorSchemes[colorScheme].name} • Customize chart colors and themes
                </Text>
              </View>
            </View>
            <View style={styles.colorPreviewContainer}>
              <View style={[styles.colorPreviewDot, { backgroundColor: theme.colors.primary }]} />
              <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Data & Privacy</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Notifications</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Get notified about insights and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Analytics</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Help improve the app by sharing anonymous usage data
                </Text>
              </View>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
              thumbColor={analyticsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Support</Text>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.surface }]} onPress={openHelpSupport}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Help & Support</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Get help and contact support
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.surface }]} onPress={rateApp}>
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Rate App</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Rate and review Dashly
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.colors.surface }]} onPress={openAboutModal}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>About</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Version 1.1.0 - Learn more about Dashly
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ColorSchemeModal
        visible={showColorSchemeModal}
        onClose={closeColorSchemeModal}
      />

      <AboutModal
        visible={showAboutModal}
        onClose={closeAboutModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorPreviewDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
