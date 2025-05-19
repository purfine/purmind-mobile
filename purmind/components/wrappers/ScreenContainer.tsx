import React, { forwardRef } from "react";
import { StyleSheet, ScrollView, ScrollViewProps, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WRScreenContainerProps extends ScrollViewProps {
  useSafeAreaView?: boolean;
}

const WRScreenContainer = forwardRef<React.ComponentRef<typeof ScrollView>, WRScreenContainerProps>((
  {useSafeAreaView = false, style, contentContainerStyle, children, ...props}, ref) => {
    // Get screen height to ensure minimum content height
    const { height: screenHeight } = Dimensions.get('window');
    
    const componentStyle = StyleSheet.create({
        screenContainer: {
            flex: 1,
            height: screenHeight,
            paddingHorizontal: 10
        },
        contentContainer: {
            paddingBottom: 20,
            minHeight: screenHeight - 100 // Ensure there's enough content to scroll
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
        >
          {children}
        </ScrollView>
      </ContainerComponent>
    );
});
  
export default WRScreenContainer;