import { StyleSheet } from "react-native";
import Text from "../../wrappers/Text";
import { useAppTheme } from "@/context/ThemeContext";
import UICard from "@/components/UI/card";

export default function ResumeDailyStatusCard() {
    const { theme } = useAppTheme();

    const componentStyle = StyleSheet.create({
      
    });
    
    return (
        <UICard fullWidth={true}>
            <Text style={{ color: theme.colors.muted }}>ResumeDailyStatusCard</Text>
        </UICard>
    );
}