import React from 'react';
import { Tabs, useSegments } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';
import { Image, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  const { theme } = useAppTheme();
  // useSegments fornece os segmentos do caminho atual
  const segments = useSegments();
  
  // Verifica se está em uma tela stack
  const isInStackScreen = segments.some(segment => segment.includes('(stack)'));

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
        tabBarStyle: { 
          backgroundColor: theme.colors.card,
          // Esconde a barra de abas em todas as telas stack
          display: isInStackScreen ? 'none' : 'flex',
        },
        // Esconde o header da tab bar em telas stack
        headerShown: !isInStackScreen,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.border,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' size={20} color={theme.colors.primary}/>,
        }}
      />
      <Tabs.Screen
        name="blocks"
        options={{
          tabBarLabel: 'Bloqueios',
          tabBarIcon: ({ color, size }) => <Ionicons name='checkmark-circle' size={20} color={theme.colors.primary}/>,
        }}
      />
    </Tabs>
    
  );
}
