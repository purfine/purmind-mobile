import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRScreenContainer from "@/components/wrappers/ScreenContainer";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import UIBadge from "@/components/UI/badge";

export default function BlocksScreen() {
  // Função para navegar para a tela de detalhes
  const navigateToBlockAbout = () => {
    router.push("/(tabs)/blocks/(stack)/BlockAbout");
  };
  const { theme } = useAppTheme();
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
        openStack
        href="/(tabs)/blocks/(stack)/BlockAbout"
        onPress={navigateToBlockAbout}
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
      <WRText style={{ marginTop: 20 }}>Sessão em andamento</WRText>
      <UICard
        style={screenStyles.cardContainer}
        fullWidth
        showProgressBar
        progressValue={20}
        openStack
        href="/(tabs)/blocks/(stack)/BlockAbout"
      >
        <View style={screenStyles.cardRowContainer}>
          {/** Left */}
          <View>
            <WRText style={{ fontSize: 40 }}>💻</WRText>
          </View>
          {/** Right */}
          <View>
            <WRText bold size={16}>Tempo de trabalho</WRText>
            <WRText style={{ marginTop: 5 }} size={13} color={theme.colors.muted}>Restante <WRText size={13}>1:49:33</WRText></WRText>
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
    </WRScreenContainer>
  );
}