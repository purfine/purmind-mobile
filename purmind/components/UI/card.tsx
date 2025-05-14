import { View, StyleSheet, ViewStyle, Text, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { Props } from "@/types/JSXTypes";
import { useEffect, useState, useCallback } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

/**
 * 
 */
interface CardProps extends Props {
    fullWidth?: boolean;

    /**
     * Accordion Configurations 
     */
    activeAccordion?: boolean;
    accordionTitle?: string;
    accordionBeOpenDefault?: boolean;
    useDividerInAccordion?: boolean;
    
    /**
     * Stack Navigation Configurations
     */
    openStack?: boolean;
    href?: string;
    onPress?: () => void;
}

/**
 * 
 * @param cardProps 
 * @returns React.JSX.Element
 * @author Victor Barberino
 */
export default function UICard({ 
        children, style, fullWidth=false, 
        activeAccordion=false, accordionTitle="", accordionBeOpenDefault=false, useDividerInAccordion=false,
        openStack=false, href="", onPress
    }: CardProps) {
    const { theme } = useAppTheme();

    /** States */
    const [withFullWidth, setWithFullWidth] = useState(false);
    const [withActiveAccordion, setWithActiveAccordion] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [useDividerAccordion, setUseDividerInAccordion] = useState(false);
    const [withOpenStack, setWithOpenStack] = useState(false);
    
    // Animation values
    const contentHeight = useSharedValue(0);
    const rotateValue = useSharedValue(0);

    /**
     * Initialize component state from props
     */
    useEffect(() => {
        setWithFullWidth(fullWidth);
        setWithActiveAccordion(activeAccordion);
        setAccordionOpen(accordionBeOpenDefault);
        setUseDividerInAccordion(useDividerInAccordion);
        setWithOpenStack(openStack);
        
        // Set initial animation values based on accordion state
        if (activeAccordion) {
            contentHeight.value = accordionBeOpenDefault ? 1 : 0;
            rotateValue.value = accordionBeOpenDefault ? 1 : 0;
        }
    }, [fullWidth, activeAccordion, accordionBeOpenDefault, useDividerInAccordion, openStack]);
    
    /**
     * Toggle accordion open/close state
     */
    const toggleAccordion = useCallback(() => {
        setAccordionOpen(prev => {
            const newState = !prev;
            // Animate height and rotation
            contentHeight.value = withTiming(newState ? 1 : 0, { duration: 300 });
            rotateValue.value = withTiming(newState ? 1 : 0, { duration: 300 });
            return newState;
        });
    }, [contentHeight, rotateValue]);
    
    /**
     * Navigate to the specified stack route
     */
    const navigateToStack = useCallback(() => {
        // Se tiver uma função onPress personalizada, use-a em vez da navegação padrão
        if (onPress) {
            onPress();
            return;
        }
        
        // Caso contrário, use a navegação padrão com href
        if (href) {
            try {
                // Tenta navegar usando o router.push
                router.push(href as any);
            } catch (error) {
                console.error('Navigation error:', error);
                
                // Fallback: tenta diferentes formatos de rota se o primeiro falhar
                if (href.startsWith('./')) {
                    // Remove o ./ e tenta novamente
                    const newPath = href.substring(2);
                    router.push(newPath as any);
                } else if (href.startsWith('/')) {
                    // Remove a / inicial e tenta novamente
                    const newPath = href.substring(1);
                    router.push(newPath as any);
                } else {
                    // Adiciona / no início e tenta novamente
                    router.push(`/${href}` as any);
                }
            }
        }
    }, [href, onPress]);
    
    /**
     * Animated styles for content container
     */
    const animatedContentStyle = useAnimatedStyle(() => {
        return {
            opacity: contentHeight.value,
            maxHeight: contentHeight.value * 1000, // Large enough value to accommodate content
            overflow: 'hidden',
        };
    });
    
    /**
     * Animated styles for the chevron icon
     */
    const animatedIconStyle = useAnimatedStyle(() => {
        const rotation = rotateValue.value * 180;
        return {
            transform: [{ rotate: `${rotation}deg` }],
        };
    });

    // Estilos base do card
    const baseStyle: ViewStyle = {
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        borderColor: theme.colors.border,
        borderWidth: 0.5,
        padding: 16,
        shadowColor: theme.colors.text,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        elevation: 3,
        width: withFullWidth ? '100%' : 'auto',
    };
    
    const componentStyle = StyleSheet.create({
        cardContainer: {
            ...baseStyle,
            ...(style as ViewStyle)
        },
        accordionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 4,
        },
        accordionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            flex: 1,
        },
        accordionContent: {
            marginTop: 8,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: 8,
        },
        iconContainer: {
            padding: 4,
        },
        stackCardContainer: {
            position: 'relative',
        },
        stackChevronContainer: {
            position: 'absolute',
            right: 16,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        stackChevronTouchable: {
            padding: 8,
            borderRadius: 15,
        }
    });

    return (
        <View style={[componentStyle.cardContainer, withOpenStack && componentStyle.stackCardContainer]}>
            {withActiveAccordion ? (
                <>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={toggleAccordion} 
                        style={componentStyle.accordionHeader}
                    >
                        <Text style={componentStyle.accordionTitle}>{accordionTitle}</Text>
                        <Animated.View style={[componentStyle.iconContainer, animatedIconStyle]}>
                            <Ionicons 
                                name="chevron-down" 
                                size={20} 
                                color={theme.colors.text} 
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    
                    <Animated.View style={animatedContentStyle}>
                        {useDividerAccordion && <View style={componentStyle.divider} />}
                        <View style={componentStyle.accordionContent}>
                            {children}
                        </View>
                    </Animated.View>
                </>
            ) : (
                children
            )}
            
            {withOpenStack && (
                <View style={componentStyle.stackChevronContainer}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={navigateToStack}
                        style={componentStyle.stackChevronTouchable}
                    >
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={theme.colors.muted} 
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}