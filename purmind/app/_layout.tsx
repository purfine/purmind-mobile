import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SplashScreen from './splash';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InnerRouter />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function InnerRouter() {
  const { loading } = useAuth();
  if (loading) {
    return <SplashScreen />;
  }
  return <Slot />;
}