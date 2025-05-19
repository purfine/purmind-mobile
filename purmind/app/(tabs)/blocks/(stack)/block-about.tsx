import WRText from "@/components/wrappers/Text";
import { StyleSheet, View, ScrollView } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import UIIcon from "@/components/UI/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import WRScreenContainer from "@/components/wrappers/ScreenContainer";

export default function BlockAbout() {
    const { theme } = useAppTheme();
    
    const styles = StyleSheet.create({
        container: {
            padding: 16,
        },
        section: {
            marginBottom: 24,
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 12,
            color: theme.colors.text,
        },
        subtitle: {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8,
            color: theme.colors.text,
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 16,
            color: theme.colors.muted,
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            gap: 12,
        },
        highlight: {
            color: theme.colors.primary,
            fontWeight: 'bold',
        },
    });
// edges={['bottom']}
    return (
        <WRScreenContainer contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <View style={styles.iconContainer}>
                        <UIIcon 
                            staticSource={require("../../../../assets/emojis/block.png")} 
                            size={40}
                        />
                        <UIIcon name="add" color="black"/>
                        <UIIcon 
                            staticSource={require("../../../../assets/emojis/purmind_capsula.png")} 
                            size={40}
                        />
                    </View>
                    <WRText style={styles.title}>
                        Bloqueios + <WRText style={styles.highlight}>Purmind</WRText>
                    </WRText>
                    <WRText style={styles.paragraph}>
                        Bloqueio de aplicativos junto com as cápsulas purmind é a combinação perfeita para melhorar seu foco e sua produtividade no dia a dia.
                    </WRText>
                </View>

                <View style={styles.section}>
                    <WRText style={styles.subtitle}>Como funciona o bloqueio de aplicativos</WRText>
                    <WRText style={styles.paragraph}>
                        O bloqueio de aplicativos permite que você defina quais apps deseja restringir o acesso durante períodos específicos, ajudando a eliminar distrações e manter o foco nas tarefas importantes.
                    </WRText>
                    <WRText style={styles.paragraph}>
                        Combine com as cápsulas Purmind para potencializar seus resultados e criar uma rotina mais produtiva e focada.
                    </WRText>
                </View>
            </View>
        </WRScreenContainer>
    );
}