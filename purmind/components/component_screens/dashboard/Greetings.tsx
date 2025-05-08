import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import WRText from '@/components/wrappers/Text';
import { useAppTheme } from '@/context/ThemeContext';
import { getGreetingMessage } from '@/services/greetingService';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing, cancelAnimation } from 'react-native-reanimated';

interface GreetingsProps {
  userName?: string;
  scrollSpeed?: number; // Speed of the marquee effect in milliseconds
}

/**
 * Greetings component that displays time-appropriate messages
 * @param props Component properties
 * @returns React.JSX.Element
 */
export default function Greetings({ userName = 'Victor', scrollSpeed = 8000 }: GreetingsProps) {
  const { theme } = useAppTheme();
  const [greetingData, setGreetingData] = useState({
    greeting: '',
    suggestion: '',
    emoji: ''
  });
  
  const screenWidth = Dimensions.get('window').width;
  const textWidth = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const shouldScroll = useSharedValue(false);
  const animationRef = useRef<number | null>(null);
  
  // Update greeting message
  useEffect(() => {
    updateGreeting();
    
    const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [userName]);
  
  // Handle the marquee animation
  useEffect(() => {
    if (shouldScroll.value) {
      // For very long text, we need to ensure it starts from a visible position
      // and then scrolls completely off-screen before repeating
      
      // First, reset position
      scrollX.value = 0;
      
      // Calculate animation duration - fixed base speed with adjustment for text length
      const baseDuration = scrollSpeed;
      const calculatedDuration = Math.max(baseDuration, textWidth.value * 15);
      
      // Create animation that moves from 0 to -textWidth (plus some padding)
      const animation = withRepeat(
        withTiming(-(textWidth.value + containerWidth.value), { 
          duration: calculatedDuration,
          easing: Easing.linear 
        }),
        -1, // Infinite repeats
        false // Don't reverse
      );
      
      scrollX.value = animation;
    } else {
      // Cancel any existing animation
      cancelAnimation(scrollX);
      scrollX.value = 0;
    }
    
    return () => {
      cancelAnimation(scrollX);
    };
  }, [shouldScroll.value, textWidth.value, containerWidth.value]);
  
  const updateGreeting = () => {
    const message = getGreetingMessage(userName);
    setGreetingData(message);
  };
  
  // Measure text container width
  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidth.value = width;
    checkIfShouldScroll();
  };
  
  // Measure text width
  const onTextLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    textWidth.value = width;
    checkIfShouldScroll();
  };
  
  // Determine if text should scroll
  const checkIfShouldScroll = () => {
    // Add a small buffer (10px) to prevent borderline cases from triggering the marquee
    if (textWidth.value > (containerWidth.value + 10) && containerWidth.value > 0) {
      shouldScroll.value = true;
      console.log('Marquee activated - Text width:', textWidth.value, 'Container width:', containerWidth.value);
    } else {
      shouldScroll.value = false;
    }
  };
  
  // Animated style for the scrolling text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shouldScroll.value ? scrollX.value : 0 }],
    };
  });
  
  const styles = StyleSheet.create({
    container: { 
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
      overflow: 'hidden'
    },
    textContainer: {
      overflow: 'hidden',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    textGreetings: {
      fontWeight: theme.fonts.semiBold.fontWeight,
      color: theme.colors.muted,
      textAlign: 'center'
    },
    highlightText: { 
      color: theme.colors.primary, 
      fontWeight: theme.fonts.bold.fontWeight 
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer} onLayout={onContainerLayout}>
        <Animated.View 
          style={[animatedStyle, { alignSelf: shouldScroll.value ? 'flex-start' : 'center' }]}
        >
          <WRText 
            style={styles.textGreetings}
            onLayout={onTextLayout}
            numberOfLines={1}
          >
            {greetingData.greeting} {greetingData.suggestion}
            ? {greetingData.emoji}
          </WRText>
        </Animated.View>
      </View>
    </View>
  );
}
