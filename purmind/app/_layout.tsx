import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot, usePathname } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SplashScreen from './splash';
import { ThemeProvider } from '../context/ThemeContext';
import { createContext, useContext, useState, useEffect } from 'react';

// Contexto para gerenciar a visibilidade do header em telas stack
interface NavigationContextType {
  hideTabBar: boolean;
  setHideTabBar: (hide: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
  hideTabBar: false,
  setHideTabBar: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export default function RootLayout() {
  const [hideTabBar, setHideTabBar] = useState(false);
  const pathname = usePathname();
  
  // Detecta automaticamente telas stack para esconder a barra de abas
  useEffect(() => {
    // Verifica se o caminho atual contém '(stack)'
    const isStackScreen = pathname.includes('(stack)');
    setHideTabBar(isStackScreen);
  }, [pathname]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContext.Provider value={{ hideTabBar, setHideTabBar }}>
          <AuthProvider>
            <InnerRouter />
          </AuthProvider>
        </NavigationContext.Provider>
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