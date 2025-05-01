import { View, StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { Props } from "@/types/JSXTypes";
import { useEffect, useState } from "react";

/**
 * 
 */
interface CardProps extends Props {
    fullWidth?: boolean;
}

/**
 * 
 * @param cardProps 
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UICard({ children, fullWidth=false }: CardProps) {
    const { theme } = useAppTheme();

    /** States */
    const [withFullWidth, setWithFullWidth] = useState(false);

    /**
     * 
     */
    useEffect(() => {
        setWithFullWidth(fullWidth);
    }, [fullWidth]);
    
    const componentStyle = StyleSheet.create({
        cardContainer: {
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            borderColor: theme.colors.border,
            borderWidth: .5,
            padding: 16,
            shadowColor: theme.colors.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,

            /* Estilos controlaveis */
            width: withFullWidth ? '100%' : 'auto',
        }
    });

    return (
        <View style={componentStyle.cardContainer}>
            {children}
        </View>
    );
}