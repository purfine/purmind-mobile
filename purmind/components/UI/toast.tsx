/*
 * @(#)toast.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * https://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  onClose,
  duration = 8000 
}) => {
  const { theme } = useAppTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4caf50',
          icon: 'checkmark-circle-outline'
        };
      case 'error':
        return {
          backgroundColor: '#f44336',
          icon: 'alert-circle-outline'
        };
      case 'warning':
        return {
          backgroundColor: '#ff9800',
          icon: 'warning-outline'
        };
      default:
        return {
          backgroundColor: '#2196f3',
          icon: 'information-circle-outline'
        };
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: toastStyle.backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons 
          name={toastStyle.icon as any} 
          size={24} 
          color="#fff" 
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast; 