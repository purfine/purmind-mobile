/*
 * @(#)ScreenContainer.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * https://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import React, { forwardRef, useEffect, useState } from "react";
import { StyleSheet, ScrollView, ScrollViewProps, Dimensions, Keyboard, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WRScreenContainerProps extends ScrollViewProps {
  useSafeAreaView?: boolean;
}

const WRScreenContainer = forwardRef<React.ComponentRef<typeof ScrollView>, WRScreenContainerProps>((
  {useSafeAreaView = false, style, contentContainerStyle, children, ...props}, ref) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { height: screenHeight } = Dimensions.get('window');
    
    useEffect(() => {
      const keyboardWillShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      
      const keyboardWillHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
        }
      );

      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }, []);
    
    const componentStyle = StyleSheet.create({
        screenContainer: {
            flex: 1,
            height: screenHeight - keyboardHeight,
            paddingHorizontal: 10
        },
        contentContainer: {
            flexGrow: 1,
            paddingBottom: 20,
            minHeight: screenHeight - keyboardHeight - 100
        }
    });
    
    const ContainerComponent = useSafeAreaView ? SafeAreaView : React.Fragment;

    return (
      <ContainerComponent>
        <ScrollView
          ref={ref}
          {...props}
          style={[componentStyle.screenContainer, ...(Array.isArray(style) ? style : [style])]}
          contentContainerStyle={[componentStyle.contentContainer, contentContainerStyle]}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      </ContainerComponent>
    );
});
  
export default WRScreenContainer;