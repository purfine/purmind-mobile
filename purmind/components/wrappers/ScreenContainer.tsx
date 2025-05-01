import { forwardRef } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const WRScreenContainer = forwardRef<React.ComponentRef<typeof View>, ViewProps>((props, ref) => {
    const componentStyle = StyleSheet.create({
        screenContainer: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 10
        }
    });
    
    return (
      <View
        ref={ref}
        {...props}
        style={[componentStyle.screenContainer, ...(Array.isArray(props.style) ? props.style : [props.style])]}
      >
        {props.children}
      </View>
    );
});
  
export default WRScreenContainer;