import UIBadge from "@/components/UI/badge";
import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { StyleSheet, View, ViewProps, Image } from "react-native";
import { BlockedApp } from "@/models/session";

export interface SessionItem {
    figure: string;
    title: string;
    endSessionInSec: number;
    startSessionInSec: number;
    progressValue?: number;
    blockedApps: BlockedApp[];
}

interface SessionCardProps extends ViewProps {
    sessionFig?: string;
    sessionTitle?: string;
    endSessionInSec?: number;
    startSessionInSec?: number;
    openStack?: boolean;
    showProgressBar?: boolean;
    href?: string;
    blockedApps?: BlockedApp[];
}

export default function SessionCard({
    sessionFig = "",
    sessionTitle = "",
    endSessionInSec = 0,
    startSessionInSec = 0,
    openStack = false,
    showProgressBar = false,
    href = undefined,
    blockedApps = []
}: SessionCardProps) {
    const { theme } = useAppTheme();

    const screenStyles = StyleSheet.create({
        cardContainer: {
            marginTop: 20
        },
        cardRowContainer: {
            flexDirection: 'row',
            gap: 20
        },
        appIcon: {
            width: 15,
            height: 15,
            borderRadius: 2
        }
    });

    const[timeRemaining, setTimeRemaining] = useState<number>(0);
    const[sessionProgressValue, setSessionProgressValue] = useState<number>(0);
    const[isActive, setIsActive] = useState<boolean>(false);
    const[hasStarted, setHasStarted] = useState<boolean>(false);

    useEffect(() => {
        const updateTimeRemaining = () => {
            const nowInSec = Math.floor(new Date().getTime() / 1000);
          
            // Calcula a duração total da sessão
            const totalDuration = endSessionInSec - startSessionInSec;
            
            // Calcula o tempo decorrido desde o início
            const elapsed = nowInSec - startSessionInSec;
            
            // Verifica se a sessão já começou
            const started = nowInSec >= startSessionInSec;
            setHasStarted(started);
            
            // Verifica se a sessão está ativa (começou mas não terminou)
            const active = started && nowInSec < endSessionInSec;
            setIsActive(active);
            
            // Calcula o tempo restante
            if (!started) {
                // Se não começou, mostra tempo até o início
                setTimeRemaining(startSessionInSec - nowInSec);
            } else if (active) {
                // Se está ativa, mostra tempo até o fim
                setTimeRemaining(endSessionInSec - nowInSec);
            } else {
                // Se já terminou, zera o tempo restante
                setTimeRemaining(0);
            }
            
            // Calcula o progresso (0-100%)
            if (active) {
                setSessionProgressValue(Math.min((elapsed / totalDuration) * 100, 100));
            } else if (!started) {
                setSessionProgressValue(0);
            } else {
                setSessionProgressValue(100);
            }
        }

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [endSessionInSec, startSessionInSec]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    // Prepara os ícones dos apps bloqueados
    const renderAppIcons = () => {
        const icons = [];
        const maxIcons = 3;

        // Adiciona até 3 ícones de apps
        for (let i = 0; i < Math.min(blockedApps.length, maxIcons); i++) {
            const app = blockedApps[i];
            icons.push(
                app.icon ? (
                    <Image
                        key={app.packageName}
                        source={{ uri: `data:image/png;base64,${app.icon}` }}
                        style={screenStyles.appIcon}
                    />
                ) : (
                    <UIIcon 
                        key={app.packageName}
                        name="apps-outline" 
                        size={15} 
                        color="#FFFFFF" 
                    />
                )
            );
        }

        // Adiciona o ícone de "mais" se houver mais apps
        if (blockedApps.length > maxIcons) {
            icons.push(
                <UIIcon 
                    name="ellipsis-horizontal" 
                    key="more" 
                    size={24} 
                    color="#FFFFFF" 
                />
            );
        }

        return icons;
    };
    
    return (
        <UICard
            style={screenStyles.cardContainer}
            fullWidth
            showProgressBar={showProgressBar}
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
                    <WRText style={{ marginTop: 5 }} size={13} color={theme.colors.muted}>
                        {!hasStarted ? "Inicia em " : isActive ? "Restante " : "Finalizada"}
                        {(!hasStarted || isActive) ? <WRText size={13}>{formatTime(timeRemaining)}</WRText> : ""}
                    </WRText>
                    <UIBadge 
                        label="Bloqueio" 
                        backgroundColor="#222222"
                        textColor="#00FF9D"
                        showStatusDot={isActive}
                        statusDotColor="#00FF9D"
                        size="small"
                        style={{ marginTop: 8 }}
                        icons={renderAppIcons()}
                    >
                        <WRText></WRText>
                    </UIBadge>
                </View>
            </View>
        </UICard>
    );
}