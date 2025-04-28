interface FontStyle {
    fontFamily: string;
    fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}
export interface AppTheme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  },
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    bold: FontStyle;
    heavy: FontStyle;
  };
}

export const lightTheme: AppTheme = {
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#c7c7c7',
    notification: '#ff80ab',
  },
  fonts: {
    regular: { fontFamily: 'Poppins', fontWeight: '400' },
    medium: { fontFamily: 'Poppins', fontWeight: '500' },
    bold: { fontFamily: 'Poppins', fontWeight: '600' },
    heavy: { fontFamily: 'Poppins', fontWeight: '700' },
  }
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#272727',
    notification: '#ff80ab',
  },
  fonts: {
    regular: { fontFamily: 'Poppins', fontWeight: '400' },
    medium: { fontFamily: 'Poppins', fontWeight: '500' },
    bold: { fontFamily: 'Poppins', fontWeight: '600' },
    heavy: { fontFamily: 'Poppins', fontWeight: '700' },
  }
};