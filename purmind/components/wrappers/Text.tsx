import React, { forwardRef } from 'react';
import { useAppTheme } from "@/context/ThemeContext";
import { Text as RNText, TextProps } from 'react-native';

interface WRTextProps extends TextProps {
  bold?: boolean;
  size?: number;
  color?: string;
}

const WRText = forwardRef<React.ComponentRef<typeof RNText>, WRTextProps>((
  {bold = false, size = undefined, color = undefined, style, ...props}, ref) => {
  const { theme } = useAppTheme();
  
  const textSize = size != undefined ? size : 14;
  const textColor = color != undefined ? color : theme.colors.text;
  
  return (
    <RNText
      ref={ref}
      {...props}
      style={[
        { 
          fontFamily: theme.fonts.regular.fontFamily, 
          fontWeight: (bold ? 'bold' : theme.fonts.regular.fontWeight),
          includeFontPadding: false,
          textAlignVertical: 'center',
          fontSize: textSize,
          color: textColor
        }, 
        style
      ]}
    />
  );
});

export default WRText;