import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import DataInputScreen from '../screens/DataInputScreen';
import SQLEditorScreen from '../screens/SQLEditorScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import components and types
import { Logo } from '../components/Logo';
import { NavigationParamList } from '../types';
import { useTheme } from '../styles/ThemeProvider';

const Tab = createBottomTabNavigator<NavigationParamList>();

export default function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'DataInput') {
                iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              } else if (route.name === 'SQLEditor') {
                iconName = focused ? 'code' : 'code-outline';
              } else if (route.name === 'AIInsights') {
                iconName = focused ? 'bulb' : 'bulb-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              height: 80,
              paddingBottom: 10,
              paddingTop: 10,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTintColor: theme.colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={DashboardScreen}
            options={{
              tabBarLabel: 'Home',
              headerTitle: 'Home',
            }}
          />
          <Tab.Screen
            name="DataInput"
            component={DataInputScreen}
            options={{
              tabBarLabel: 'Data Input',
              headerTitle: 'Import Data',
            }}
          />
          <Tab.Screen
            name="SQLEditor"
            component={SQLEditorScreen}
            options={{
              tabBarLabel: 'SQL Editor',
              headerTitle: 'SQL Editor',
            }}
          />
          <Tab.Screen
            name="AIInsights"
            component={AIInsightsScreen}
            options={{
              tabBarLabel: 'AI Insights',
              headerTitle: 'AI Insights',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              headerTitle: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
  );
}
