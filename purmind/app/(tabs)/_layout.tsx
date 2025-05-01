import React from 'react';
import { Tabs } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';
import { Image, Text } from 'react-native';
import Icon from 'react-native-ionicons'

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <Image source={require('../../assets/images/logo.png')} style={{ width: 120, height: 32, resizeMode: 'contain' }} />
        ),
        headerRight: () => (
          <Text>Right</Text>
        ),
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.card },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.border,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon ios='home-outline' android='home-outline'  size={20} color={theme.colors.primary}/>,
        }}
      />
      <Tabs.Screen
        name="blocks/index"
        options={{
          tabBarLabel: 'Bloqueios',
          tabBarIcon: ({ color, size }) => <Icon ios='home-outline' android='home-outline'  size={20} color={theme.colors.primary}/>,
        }}
      />
    </Tabs>
    
  );
}
