import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SplashScreen from './splash';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <InnerRouter />
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function InnerRouter() {
  const { loading } = useAuth();
  const { theme, isDark } = useTheme();
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer theme={{ dark: isDark, colors: theme.colors, fonts: theme.fonts}}>
      <Slot />
    </NavigationContainer>
  );
}