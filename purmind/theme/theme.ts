interface FontStyle {
    fontFamily: string;
    fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}
export interface AppTheme {
  colors: {
    primary: string;
    primaryGradient: string[];
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  },
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    semiBold: FontStyle;
    bold: FontStyle;
  };
}

export const lightTheme: AppTheme = {
  colors: {
    primary: '#6823D1',
    primaryGradient: ['#6823D1', '#46198B'],
    background: '#F1F0F5',
    card: '#ffffff',
    text: '#000000',
    border: '#c7c7c7',
    notification: '#ff80ab',
  },
  fonts: {
    regular: { fontFamily: 'Urbanist-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Urbanist-Medium', fontWeight: '500' },
    semiBold: { fontFamily: 'Urbanist-SemiBold', fontWeight: '600' },
    bold: { fontFamily: 'Urbanist-Bold', fontWeight: '700' },
  }
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#bb86fc',
    primaryGradient: ['#bb86fc', '#9068fd'],
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#272727',
    notification: '#ff80ab',
  },
  fonts: {
    regular: { fontFamily: 'Urbanist-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Urbanist-Medium', fontWeight: '500' },
    semiBold: { fontFamily: 'Urbanist-SemiBold', fontWeight: '600' },
    bold: { fontFamily: 'Urbanist-Bold', fontWeight: '700' },
  }
};