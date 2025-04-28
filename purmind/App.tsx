import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './app/_layout';

export default function App() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}