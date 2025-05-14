import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import WRText from '@/components/wrappers/Text';
import { useAppTheme } from '@/context/ThemeContext';
import { getGreetingMessage } from '@/services/greetingService';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  Easing, 
  cancelAnimation, 
  runOnJS,
  useAnimatedReaction 
} from 'react-native-reanimated';

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
  
  // React state to store layout measurements
  const [textMeasured, setTextMeasured] = useState(false);
  const [containerMeasured, setContainerMeasured] = useState(false);
  
  // Shared values for animations
  const textWidth = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const shouldScroll = useSharedValue(false);
  
  // Update greeting message
  useEffect(() => {
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [userName]);
  
  // Check if we should scroll when measurements change
  useEffect(() => {
    if (textMeasured && containerMeasured) {
      checkIfShouldScroll();
    }
  }, [textMeasured, containerMeasured]);
  
  // Use animated reaction to trigger animation when shouldScroll changes
  useAnimatedReaction(
    () => shouldScroll.value,
    (shouldScrollNow, previousValue) => {
      if (shouldScrollNow) {
        // Reset position
        scrollX.value = 0;
        
        // Calculate animation duration
        const baseDuration = scrollSpeed;
        const calculatedDuration = Math.max(baseDuration, textWidth.value * 15);
        
        // Create animation
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
        cancelAnimation(scrollX);
        scrollX.value = 0;
      }
    },
    [scrollSpeed] // Dependencies for the worklet
  );
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(scrollX);
    };
  }, []);
  
  const updateGreeting = () => {
    const message = getGreetingMessage(userName);
    setGreetingData(message);
  };
  
  // Measure text container width
  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidth.value = width;
    setContainerMeasured(true);
  };
  
  // Measure text width
  const onTextLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    textWidth.value = width;
    setTextMeasured(true);
  };
  
  // Determine if text should scroll
  const checkIfShouldScroll = () => {
    const textWidthVal = textWidth.value;
    const containerWidthVal = containerWidth.value;
    
    if (textWidthVal > (containerWidthVal + 10) && containerWidthVal > 0) {
      shouldScroll.value = true;
      console.log('Marquee activated - Text width:', textWidthVal, 'Container width:', containerWidthVal);
    } else {
      shouldScroll.value = false;
    }
  };
  
  // Animated style for the scrolling text
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: scrollX.value }],
      alignSelf: shouldScroll.value ? 'flex-start' : 'center'
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
          style={animatedStyle}
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
