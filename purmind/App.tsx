import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './app/_layout';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';

export default function App() {
  const [loaded] = useFonts({
    'Urbanist-Regular':   require('./assets/fonts/urbanist/Urbanist-Regular.ttf'),
    'Urbanist-Medium':    require('./assets/fonts/urbanist/Urbanist-Medium.ttf'),
    'Urbanist-SemiBold':  require('./assets/fonts/urbanist/Urbanist-SemiBold.ttf'),
    'Urbanist-Bold':      require('./assets/fonts/urbanist/Urbanist-Bold.ttf'),
  });

  if (!loaded) {
    return (
      <>
        <Text>Houve um erro ao carregar as fontes.</Text>
      </>
    );
  } 
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}