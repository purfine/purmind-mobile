import React, { forwardRef } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { Text as RNText, TextProps } from 'react-native';

const Text = forwardRef<React.ComponentRef<typeof RNText>, TextProps>((props, ref) => {
  const { theme } = useTheme();
  return (
    <RNText
      ref={ref}
      {...props}
      style={[{ fontFamily: theme.fonts.regular.fontFamily, fontWeight: theme.fonts.regular.fontWeight }, props.style]}
    />
  );
});

export default Text;