import UIBadge from "@/components/UI/badge";
import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export interface SessionItem {
    figure: string;
    title: string;
    endSessionInSec: number;
    startSessionInSec: number;
    progressValue?: number;
}

interface SessionCardProps extends ViewProps {
    sessionFig?: string;
    sessionTitle?: string;
    endSessionInSec?: number;
    startSessionInSec?: number;
    openStack?: boolean;
    showProgressBar?: boolean;
    href?:string;
}

export default function SessionCard({
    sessionFig = "",
    sessionTitle = "",
    endSessionInSec = 0,
    startSessionInSec = 0,
    openStack = false,
    showProgressBar = false,
    href = undefined
}: SessionCardProps) {
    const { theme } = useAppTheme();

    const screenStyles = StyleSheet.create({
        cardContainer: {
            marginTop: 20
        },
        cardRowContainer: {
            flexDirection: 'row',
            gap: 20
        }
    });

    const[timeRemaining, setTimeRemaining] = useState<number>(0);
    const[sessionProgressValue, setSessionProgressValue] = useState<number>(0);

    useEffect(() => {
        const updateTimeRemaining = () => {
            const nowInSec = Math.floor(new Date().getTime() / 1000);
          
            const totalDuration = endSessionInSec - startSessionInSec;
            const elapsed = nowInSec - startSessionInSec;
            const diff = endSessionInSec - nowInSec;

            setSessionProgressValue(Math.min((elapsed / totalDuration) * 100, 100))
            setTimeRemaining(diff > 0 ? diff : 0);
        }

        const interval = setInterval(() => { updateTimeRemaining() }, 1000);

        return () => clearInterval(interval);
    }, [endSessionInSec])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };
    
    return (
        <>
            <UICard
                style={screenStyles.cardContainer}
                fullWidth
                showProgressBar
                progressValue={sessionProgressValue}
                openStack={openStack}
                href={href}
            >
                <View style={screenStyles.cardRowContainer}>
                    {/** Left */}
                    <View>
                        <WRText style={{ fontSize: 40 }}>{sessionFig}</WRText>
                    </View>
                    {/** Right */}
                    <View>
                        <WRText bold size={16}>{sessionTitle}</WRText>
                        <WRText style={{ marginTop: 5 }} size={13} color={theme.colors.muted}>Restante <WRText size={13}>{formatTime(timeRemaining)}</WRText></WRText>
                        <UIBadge 
                        label="Bloqueio" 
                        backgroundColor="#222222"
                        textColor="#00FF9D"
                        showStatusDot={true}
                        statusDotColor="#00FF9D"
                        size="small"
                        style={{ marginTop: 8 }}
                        icons={[
                            <UIIcon name="logo-facebook" size={15} color="#1877F2" />,
                            <UIIcon name="logo-instagram" key="instagram" size={15} color="#E1306C" />,
                            <UIIcon name="logo-tiktok" key="tiktok" size={15} color="#FFFFFF" />,
                            <UIIcon name="ellipsis-horizontal" key="more" size={24} color="#FFFFFF" />
                        ]}
                        ><WRText></WRText></UIBadge>
                    </View>
                </View>
            </UICard>
        </>
    )
}