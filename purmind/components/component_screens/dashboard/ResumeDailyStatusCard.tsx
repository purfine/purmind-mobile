import { StyleSheet } from "react-native";
import Text from "../../wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import UICard from "@/components/UI/card";

export default function ResumeDailyStatusCard() {
    const { theme } = useAppTheme();

    const componentStyle = StyleSheet.create({
      cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      }
    });
    
    return (
        <UICard fullWidth={true} style={componentStyle.cardContainer}>
            <Text style={{ color: theme.colors.muted }}>ResumeDailyStatusCard</Text>
        </UICard>
    );
}