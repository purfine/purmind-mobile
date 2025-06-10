/*
 * @(#)_layout.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * https://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import { Stack, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity, Text, Platform, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 0,
      },
    }),
  },
});

export default function StackLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  
  const statusBarStyle = theme.colors.background === '#121212' ? 'light' : 'dark';
  
  const goBack = () => {
    router.back();
  };
  
  const CustomBackButton = () => (
    <TouchableOpacity 
      onPress={goBack} 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 16,
      }}
    >
      <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.primary, marginLeft: 2, fontSize: 16 }}>Voltar</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaProvider style={styles.container}>
      <ExpoStatusBar style={statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackTitle: '',
          headerBackVisible: true,
          headerLeft: Platform.OS === 'ios' ? () => <CustomBackButton /> : undefined,
        }}
      >
        <Stack.Screen 
          name="block-about" 
          options={{
            title: 'Bloqueios + Purmind',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTransparent: false,
            headerBackVisible: Platform.OS !== 'ios',
            headerBackTitle: '',
            headerLeft: Platform.OS === 'ios' ? () => <CustomBackButton /> : undefined
          }}
        />

        <Stack.Screen 
          name="schedule-session-screen" 
          options={{
            title: 'Nova sessão',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTransparent: false,
            headerBackVisible: Platform.OS !== 'ios',
            headerBackTitle: '',
            headerLeft: Platform.OS === 'ios' ? () => <CustomBackButton /> : undefined
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
