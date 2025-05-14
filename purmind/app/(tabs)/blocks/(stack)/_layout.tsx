import { Stack, useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StackLayout() {
  const { theme } = useAppTheme();
  const router = useRouter();
  
  // Define o estilo da status bar para combinar com o tema
  const statusBarStyle = theme.colors.background === '#121212' ? 'light' : 'dark';
  
  // Função para voltar à tela anterior
  const goBack = () => {
    router.back();
  };
  
  // Componente personalizado para o botão de voltar
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
    <SafeAreaProvider>
      <StatusBar style={statusBarStyle} />
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
        // Configurações específicas para o botão de voltar
        headerBackTitle: '', // Remove o texto do botão de voltar no iOS
        headerBackVisible: true, // Garante que o botão de voltar esteja visível
        // Botão de voltar personalizado para iOS
        headerLeft: Platform.OS === 'ios' ? () => <CustomBackButton /> : undefined
      }}
    >
      <Stack.Screen 
        name="BlockAbout" 
        options={{
          title: 'Bloqueios + Purmind',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          // Configurações para o header
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          // Configurações para o conteúdo
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          // Usa SafeAreaView para lidar com a status bar
          headerTransparent: false,
          // Configurações específicas para o botão de voltar no iOS
          headerBackVisible: Platform.OS !== 'ios', // Esconde o botão padrão no iOS
          headerBackTitle: '',
          // Botão de voltar personalizado para iOS
          headerLeft: Platform.OS === 'ios' ? () => <CustomBackButton /> : undefined
        }}
      />
    </Stack>
    </SafeAreaProvider>
  );
}
