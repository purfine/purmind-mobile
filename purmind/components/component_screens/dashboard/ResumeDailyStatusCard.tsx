import { Image, StyleSheet, View } from "react-native";
import WRText from "../../wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import UICard from "@/components/UI/card";
import UIButton from "@/components/UI/button";

export default function ResumeDailyStatusCard() {
    const { theme } = useAppTheme();

    const componentStyle = StyleSheet.create({
      cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      }
    });
    
    return (
        <UICard fullWidth={true} style={componentStyle.cardContainer} activeAccordion={true} accordionTitle="Resumo Diário" accordionBeOpenDefault={true}>
            <View style={{ alignItems: 'center' }}>
              <Image source={require('@/assets/images/memoji_thinking.png')} style={{ width: 110, height: 110 }} />
              <View style={{ marginTop: 15 }}>
                <WRText style={{ color: theme.colors.muted, textAlign: 'center', fontSize: 16 }}>Você ainda não tem dados para exibir</WRText>
                <WRText style={{ color: theme.colors.muted, marginTop: 5, textAlign: 'center', fontSize: 16 }}>Por que não configura sua agenda?</WRText>
                <UIButton style={{ marginTop: 20, marginBottom: 5 }} text="Ir para agenda" />
              </View>
            </View>
        </UICard>
    );
}