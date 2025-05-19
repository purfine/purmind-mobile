import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WRText from '@/components/wrappers/Text';
import { useAppTheme } from '@/context/ThemeContext';
import { getGreetingMessage } from '@/services/greetingService';
import { Marquee } from '@animatereactnative/marquee';

interface GreetingsProps {
  userName?: string;
  scrollSpeed?: number; // Speed of the marquee effect (1 is slow, higher numbers are faster)
  spacing?: number; // Spacing between repeated text elements
}

/**
 * Greetings component that displays time-appropriate messages
 * @param props Component properties
 * @returns React.JSX.Element
 */
export default function Greetings({ userName = 'Victor', scrollSpeed = 0.5, spacing = 20 }: GreetingsProps) {
  const { theme } = useAppTheme();
  const [greetingData, setGreetingData] = useState({
    greeting: '',
    suggestion: '',
    emoji: ''
  });
  
  // Update greeting message
  useEffect(() => {
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [userName]);
  
  const updateGreeting = () => {
    const message = getGreetingMessage(userName);
    setGreetingData(message);
  };
  
  const styles = StyleSheet.create({
    container: { 
      marginVertical: 20,
      overflow: 'hidden'
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
      <Marquee spacing={spacing} speed={scrollSpeed}>
        <WRText style={styles.textGreetings} numberOfLines={1}>
          {greetingData.greeting} {greetingData.suggestion}
          ? {greetingData.emoji}
        </WRText>
      </Marquee>
    </View>
  );
}
