import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { lightTheme, darkTheme, AppTheme } from '../theme/theme';

interface ThemeContextType {
  theme: AppTheme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => Promise<void>;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  colorScheme: 'light',
  toggleTheme: async () => {},
  isDark: false
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = Appearance.getColorScheme() as ColorSchemeName;
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme || 'light');
  const [theme, setTheme] = useState<AppTheme>(
    colorScheme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync('theme');
      if (stored === 'dark' || stored === 'light') {
        setColorScheme(stored);
      }
    })();
  }, []);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  const toggleTheme = async () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
    await SecureStore.setItemAsync('theme', newScheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, isDark: colorScheme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme(){
  const context = useContext(ThemeContext); 
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
