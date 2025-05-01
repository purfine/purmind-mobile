import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SplashScreen from './splash';
import { ThemeProvider } from '../context/ThemeContext';

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
  if (loading) {
    return <SplashScreen />;
  }
  return <Slot />;
}