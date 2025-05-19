/*
  Temas de cores do aplicativo.
  É PROÍBIDO QUALQUER TIPO DE ALTERAÇÃO NESTE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA.
*/
interface FontStyle {
    fontFamily: string;
    fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}
interface TimeColor {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}
interface TextTimeColor {
  light: TimeColor,
  regular: TimeColor,
  semiBold: TimeColor,
  bold: TimeColor,
}
export interface AppTheme {
  type: 'light' | 'dark';
  colors: {
    primary: string;
    primaryGradient: string[];
    background: string;
    card: string;
    text: string;
    muted: string;
    border: string;
    notification: string;
    dividerColor: string;
  },
  fonts: {
    regular: FontStyle;
    medium: FontStyle;
    semiBold: FontStyle;
    bold: FontStyle;
  },
  timeColors: {
    text: TextTimeColor;
  },
  icons: {
    backgroundColor: string;
  }
}

export const lightTheme: AppTheme = {
  type: 'light',
  colors: {
    primary: '#6823D1',
    primaryGradient: ['#6823D1', '#46198B'],
    background: '#F1F0F5',
    card: '#ffffff',
    text: '#000000',
    muted: "#868686",
    border: '#c7c7c7',
    notification: '#ff80ab',
    dividerColor: "#BFBFBF"
  },
  fonts: {
    regular: { fontFamily: 'Urbanist-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Urbanist-Medium', fontWeight: '500' },
    semiBold: { fontFamily: 'Urbanist-SemiBold', fontWeight: '600' },
    bold: { fontFamily: 'Urbanist-Bold', fontWeight: '700' },
  },
  timeColors: {
    text: {
      light: {
        morning: '#E5B2F8',
        afternoon: '#FFE6CB',
        evening: '#95BAFF',
        night: '#FFFFFF',
      },
      regular: {
        morning: '#E5B2F8',
        afternoon: '#FFE6CB',
        evening: '#95BAFF',
        night: '#FFFFFF',
      },
      semiBold: {
        morning: '#8143BF',
        afternoon: '#FB8915',
        evening: '#3E77E3',
        night: '#FFFFFF',
      },
      bold: {
        morning: '#8143BF',
        afternoon: '#FB8915',
        evening: '#3E77E3',
        night: '#FFFFFF',
      },
    }
  },
  icons: {
    backgroundColor: "#ECECEC"
  }
};

export const darkTheme: AppTheme = {
  type: 'dark',
  colors: {
    primary: '#9A6CFF', // tom mais vibrante no fundo escuro
    primaryGradient: ['#9A6CFF', '#6E42C1'], // degradê mais forte
    background: '#121212',
    card: '#1C1C1E', // mais agradável que puro preto
    text: '#F5F5F5',
    muted: "#A6A6A6", // mais claro para legibilidade
    border: '#2C2C2E',
    notification: '#FF99B3', // mais suave e visível
    dividerColor: "#3A3A3C"
  },
  fonts: {
    regular: { fontFamily: 'Urbanist-Regular', fontWeight: '400' },
    medium: { fontFamily: 'Urbanist-Medium', fontWeight: '500' },
    semiBold: { fontFamily: 'Urbanist-SemiBold', fontWeight: '600' },
    bold: { fontFamily: 'Urbanist-Bold', fontWeight: '700' },
  },
  timeColors: {
    text: {
      light: {
        morning: '#D1A6F2',     // tom claro suave
        afternoon: '#FFD9A3',   // caloroso, sem ofuscar
        evening: '#A8C6FF',     // mais visível que #95BAFF
        night: '#FFFFFF',
      },
      regular: {
        morning: '#D1A6F2',
        afternoon: '#FFD9A3',
        evening: '#A8C6FF',
        night: '#FFFFFF',
      },
      semiBold: {
        morning: '#A66DD1',
        afternoon: '#FF9F3E',
        evening: '#5A92E6',
        night: '#FFFFFF',
      },
      bold: {
        morning: '#A66DD1',
        afternoon: '#FF9F3E',
        evening: '#5A92E6',
        night: '#FFFFFF',
      },
    }
  },
  icons: {
    backgroundColor: "#2B2B2B" // tom escuro mais neutro para destacar ícones claros
  }
};