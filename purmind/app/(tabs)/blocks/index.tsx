import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRScreenContainer from "@/components/wrappers/ScreenContainer";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import SessionCard from "@/components/component_screens/blocks/SessionCard";
import { useCallback, useState } from "react";
import { getAllSessions, getActiveSession, Session } from "@/mock/sessions";

export default function BlocksScreen() {
  const { theme } = useAppTheme();

  // Estado para armazenar a sessão ativa e todas as sessões
  const [activeSession, setActiveSession] = useState<Session | undefined>();
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  
  // Atualizar os dados quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      // Buscar a sessão ativa e todas as sessões
      setActiveSession(getActiveSession());
      setAllSessions(getAllSessions());
    }, [])
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
    badgeIcon: {

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

      {/** Sessão em andamento */}
      <WRText style={{ marginTop: 20 }} bold size={16}>Sessão em andamento</WRText>
      {activeSession ? (
        <SessionCard
          sessionFig={activeSession.figure}
          sessionTitle={activeSession.title}
          showProgressBar
          openStack={true}
          endSessionInSec={activeSession.endSessionInSec}
          startSessionInSec={activeSession.startSessionInSec}
        />
      ) : (
        <WRText style={{ marginTop: 10, marginBottom: 10 }} color={theme.colors.muted}>
          Nenhuma sessão em andamento. Agende uma nova sessão abaixo.
        </WRText>
      )}
      
      {/** Sessões agendadas */}
      {allSessions.length > 0 && (
        <>
          <WRText style={{ marginTop: 20 }} bold size={16}>Sessões agendadas</WRText>
          {allSessions.map((session) => (
            <SessionCard
              key={session.id}
              sessionFig={session.figure}
              sessionTitle={session.title}
              showProgressBar
              openStack={true}
              endSessionInSec={session.endSessionInSec}
              startSessionInSec={session.startSessionInSec}
            />
          ))}
        </>
      )}
    
     {/** Agendar sessão */} 
      <WRText style={{ marginTop: 20 }} bold size={16}>Nova sessão</WRText>
      <View style={{ marginTop: 20 }}>
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