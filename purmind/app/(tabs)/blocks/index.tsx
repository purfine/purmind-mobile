import UICard from "@/components/UI/card";
import UIIcon from "@/components/UI/icon";
import WRScreenContainer from "@/components/wrappers/ScreenContainer";
import WRText from "@/components/wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function BlocksScreen() {
  // Função para navegar para a tela de detalhes
  const navigateToBlockAbout = () => {
    router.push("/(tabs)/blocks/(stack)/BlockAbout");
  };
  const { theme } = useAppTheme();
  const screenStyles = StyleSheet.create({
    cardAboutContainer: {
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
    }
  });

  return (
    <WRScreenContainer>
      {/* Card with information about blocks */}
      <UICard 
        fullWidth 
        style={screenStyles.cardContainer}
        openStack={true}
        href="/(tabs)/blocks/(stack)/BlockAbout"
        onPress={navigateToBlockAbout}
      >
        <View style={screenStyles.cardAboutContainer}>
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
    </WRScreenContainer>
  );
}