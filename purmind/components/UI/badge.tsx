import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Props } from '@/types/JSXTypes';
import { useAppTheme } from '@/context/ThemeContext';

interface BadgeProps extends Props {
  /**
   * Badge label text
   */
  label: string;
  
  /**
   * Badge color configuration
   */
  backgroundColor?: string;
  textColor?: string;
  
  /**
   * Badge size and style configuration
   */
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  
  /**
   * Badge status indicator
   */
  showStatusDot?: boolean;
  statusDotColor?: string;
  
  /**
   * Badge icons configuration
   */
  icons?: React.ReactNode[];
}

/**
 * UI Badge component
 * 
 * @param badgeProps 
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UIBadge({
  label,
  style,
  backgroundColor,
  textColor,
  size = 'medium',
  rounded = true,
  showStatusDot = false,
  statusDotColor,
  icons = [],
  children
}: BadgeProps) {
  const { theme } = useAppTheme();
  
  // Determine sizes based on the size prop
  const sizeConfig = {
    small: {
      height: 24,
      paddingHorizontal: 8,
      fontSize: 12,
      dotSize: 6,
      iconSize: 16,
      gap: 4
    },
    medium: {
      height: 32,
      paddingHorizontal: 12,
      fontSize: 14,
      dotSize: 8,
      iconSize: 20,
      gap: 6
    },
    large: {
      height: 40,
      paddingHorizontal: 16,
      fontSize: 16,
      dotSize: 10,
      iconSize: 24,
      gap: 8
    }
  };
  
  const selectedSize = sizeConfig[size];
  
  // Default colors from theme if not provided
  const bgColor = backgroundColor || theme.colors.primary;
  const txtColor = textColor || '#FFFFFF';
  const dotColor = statusDotColor || '#00FF9D'; // Bright green dot by default
  
  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgColor,
      height: selectedSize.height,
      paddingHorizontal: selectedSize.paddingHorizontal,
      borderRadius: rounded ? selectedSize.height / 2 : 4,
      gap: selectedSize.gap,
      ...(style as ViewStyle)
    },
    statusDot: {
      width: selectedSize.dotSize,
      height: selectedSize.dotSize,
      borderRadius: selectedSize.dotSize / 2,
      backgroundColor: dotColor,
      marginRight: 4
    },
    label: {
      color: txtColor,
      fontSize: selectedSize.fontSize,
      fontWeight: '500',
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: selectedSize.gap / 2,
      marginLeft: 5
    }
  });
  
  return (
    <View style={styles.badge}>
      {showStatusDot && <View style={styles.statusDot} />}
      <Text style={styles.label}>{label}</Text>
      
      {icons.length > 0 && (
        <View style={styles.iconsContainer}>
          {icons.map((icon, index) => (
            <React.Fragment key={`icon-${index}`}>
              {icon}
            </React.Fragment>
          ))}
        </View>
      )}
      
      {children}
    </View>
  );
}
