import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import UIButton from "@/components/UI/button";
import ImageBgCard from "@/components/UI/image-bg-card";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { getCurrentTimePeriod } from "@/util/time-util";

export default function DailyBar() {
    const { theme } = useAppTheme();
    const [currentTime, setCurrentTime] = useState("");
    const [regularTimeTextColor, setRegularTimeTextColor] = useState("#FFFFFF");
    const [boldTimeTextColor, setBoldTimeTextColor] = useState("#FFFFFF");
    const [backgroundImage, setBackgroundImage] = useState(require('@/assets/images/good-morning-bg.png'));
    const [greetingMessage, setGreetingMessage] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        
        updateTime();
        
        const intervalId = setInterval(updateTime, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const updateColor = () => {
            const timePeriod = getCurrentTimePeriod();
            if (timePeriod === 'morning') {
                setRegularTimeTextColor(theme.timeColors.text.light.morning);
                setBoldTimeTextColor(theme.timeColors.text.bold.morning);
                setBackgroundImage(require('@/assets/images/good-morning-bg.png'));
                setGreetingMessage("Bom dia Victor! ☀️")
            } else if (timePeriod === 'afternoon') {
                setRegularTimeTextColor(theme.timeColors.text.light.afternoon);
                setBoldTimeTextColor(theme.timeColors.text.bold.afternoon);
                setBackgroundImage(require('@/assets/images/good-afternoon-bg.png'));
                setGreetingMessage("Boa tarde Victor! ☀️")
            } else if (timePeriod === 'evening') {
                setRegularTimeTextColor(theme.timeColors.text.light.evening);
                setBoldTimeTextColor(theme.timeColors.text.bold.evening);
                setBackgroundImage(require('@/assets/images/good-evening-bg.png'));
                setGreetingMessage("Boa noite Victor! 🌃")
            } else if (timePeriod === 'night') {
                setRegularTimeTextColor(theme.timeColors.text.light.night);
                setBoldTimeTextColor("black");
                setBackgroundImage(require('@/assets/images/good-night-bg.png'));
                setGreetingMessage("Boa noite Victor! 🌙")
            }
        };
        
        updateColor();
        
        const intervalId = setInterval(updateColor, 1000);
        
        return () => clearInterval(intervalId);
    }, [theme]);
    
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeText: {
            fontSize: 50,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
            color: regularTimeTextColor,
        },
        greetingText: {
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 4,
            color: regularTimeTextColor
        },
        button: {
            marginTop: 12,
            backgroundColor: regularTimeTextColor
        }
    });
    
    return (
        <>
            <ImageBgCard 
                imageSource={backgroundImage} 
                borderRadius={8} 
                overlayOpacity={0.5}
                fullWidth={true}
                style={{ marginTop: 20 }}
            >
                <View style={styles.container}>
                    <WRText style={styles.timeText}>{currentTime}</WRText>
                    <WRText style={styles.greetingText}>{greetingMessage}</WRText>
                    <WRText style={styles.greetingText}>Já tomou sua <WRText style={{ fontWeight: 'bold', color: boldTimeTextColor }}>purmind</WRText> hoje?</WRText>
                    <UIButton 
                        text="Ver Calendário" 
                        textColor={boldTimeTextColor}  
                        style={styles.button}
                    />
                </View>
            </ImageBgCard>
        </>
    );
}