import React from 'react';
import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRScreenContainer from "@/components/wrappers/ScreenContainer";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useFocusEffect, router } from "expo-router";
import SessionCard from "@/components/component_screens/blocks/SessionCard";
import { useCallback, useState, useEffect } from "react";
import { Session } from "@/models/session";
import { useSession } from "@/hooks/useSession";
import UIButton from "@/components/UI/button";

export default function BlocksScreen() {
  const { theme } = useAppTheme();
  const { sessions, activeSession, nextSession, loadSessions } = useSession();

  // Estado para armazenar as próximas sessões
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  
  // Atualizar as próximas sessões quando as sessions mudarem
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const upcoming = sessions
      .filter(session => session.startSessionInSec > now)
      .sort((a, b) => a.startSessionInSec - b.startSessionInSec);
    setUpcomingSessions(upcoming);
  }, [sessions]);
  
  // Carregar sessões quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const screenStyles = StyleSheet.create({
    cardRowContainer: {
      flexDirection: 'row',
      gap: 20
    },
    cardAboutTitle: { 
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
      color: theme.colors.text
    },
    cardAboutTitlePrimary: {
      color: theme.colors.primary, 
      fontWeight: 'bold',
      fontSize: 18
    },
    cardAboutSummary: {
      color: theme.colors.muted,
      flexShrink: 1,
      flexWrap: 'wrap'
    },
    cardContainer: {
      marginTop: 20
    },
    sectionTitle: {
      marginTop: 20,
      marginBottom: 10
    },
    viewAllButton: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    allSessionsButton: {
      marginTop: 20,
      marginBottom: 20
    }
  });

  return (
    <WRScreenContainer>
      {/* Card with information about blocks */}
      <UICard 
        fullWidth 
        style={screenStyles.cardContainer}
        openStack={true}
        href="/(tabs)/blocks/(stack)/block-about"
      >
        <View style={screenStyles.cardRowContainer}>
          {/** Left */}
          <View>
            <UIIcon 
              staticSource={require("../../../assets/emojis/block.png")} 
              size={50}
            />
            <UIIcon name="add" color="black" style={{  }}/>
            <UIIcon 
              staticSource={require("../../../assets/emojis/purmind_capsula.png")} 
              size={50}
            />
          </View>

          {/** Right */}
          <View style={{ flex: 1 }}>
            <WRText style={screenStyles.cardAboutTitle}>
              Bloqueios + <WRText style={screenStyles.cardAboutTitlePrimary}>Purmind</WRText>
            </WRText>
            <WRText style={screenStyles.cardAboutSummary}>
              Bloqueio de aplicativos junto com as cápsulas purmindé a combinação perfeita  para melhorar seu foco e sua produtividade no dia a dia. Veja como funciona o bloqueio de aplicativos...
            </WRText>
          </View>
        </View>
      </UICard>

      {/** Sessão ativa */}
      <WRText bold size={16} style={screenStyles.sectionTitle}>Sessão ativa</WRText>
      {activeSession ? (
        <SessionCard
          sessionFig={activeSession.figure}
          sessionTitle={activeSession.title}
          showProgressBar
          openStack={true}
          endSessionInSec={activeSession.endSessionInSec}
          startSessionInSec={activeSession.startSessionInSec}
          blockedApps={activeSession.blockedApps}
        />
      ) : nextSession ? (
        <>
          <WRText style={{ marginTop: 10, marginBottom: 10 }} color={theme.colors.muted}>
            Nenhuma sessão em andamento.
          </WRText>
          <WRText bold size={16} style={screenStyles.sectionTitle}>Próxima sessão</WRText>
          <SessionCard
            sessionFig={nextSession.figure}
            sessionTitle={nextSession.title}
            showProgressBar
            openStack={true}
            endSessionInSec={nextSession.endSessionInSec}
            startSessionInSec={nextSession.startSessionInSec}
            blockedApps={nextSession.blockedApps}
          />
        </>
      ) : (
        <WRText style={{ marginTop: 10, marginBottom: 10 }} color={theme.colors.muted}>
          Nenhuma sessão em andamento. Agende uma nova sessão abaixo.
        </WRText>
      )}
      
      {/** Próximas sessões */}
      {upcomingSessions.length > 0 && upcomingSessions[0]?.id !== nextSession?.id && (
        <>
          <WRText bold size={16} style={screenStyles.sectionTitle}>Outras sessões</WRText>
          {upcomingSessions
            .filter(session => session.id !== nextSession?.id)
            .slice(0, 2)
            .map((session) => (
              <SessionCard
                key={session.id}
                sessionFig={session.figure}
                sessionTitle={session.title}
                showProgressBar
                openStack={true}
                endSessionInSec={session.endSessionInSec}
                startSessionInSec={session.startSessionInSec}
                blockedApps={session.blockedApps}
              />
            ))}
        </>
      )}

      {/** Botão Ver minhas sessões */}
      <UIButton
        text="Ver minhas sessões"
        icon="calendar-outline"
        size="medium"
        textStyle={{ fontSize: 14, fontWeight: 'regular' }}
        hasBackground={false}
      />

      {/** Agendar sessão */} 
      <WRText bold size={16} style={screenStyles.sectionTitle}>Nova sessão</WRText>
      <View style={{ marginTop: 10 }}>
        <UICard openStack={true} href="/blocks/schedule-session-screen">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UIIcon name="calendar-outline" size={24} color={theme.colors.primary} />
            <WRText style={{ marginLeft: 10 }}>Agendar nova sessão</WRText>
          </View>
        </UICard>
      </View>
    </WRScreenContainer>
  );
}