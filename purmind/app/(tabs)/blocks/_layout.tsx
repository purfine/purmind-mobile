import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';

export default function BlocksLayout() {
  const { theme } = useAppTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="(stack)" 
        options={{
          headerShown: false
        }}
      />
      {/* A configuração da tela BlockAbout foi movida para o layout da pasta (stack) */}
    </Stack>
  );
}
