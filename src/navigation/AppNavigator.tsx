import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

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
              borderTopWidth: 0,
              elevation: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              height: Platform.OS === 'android' ? 70 + insets.bottom : 85,
              paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : 20,
              paddingTop: 15,
              paddingHorizontal: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 4,
            },
            tabBarIconStyle: {
              marginTop: 2,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
              borderBottomWidth: 0,
              elevation: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
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
              headerShown: false,
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
