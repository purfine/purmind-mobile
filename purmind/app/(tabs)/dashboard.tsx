import { StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import ResumeDailyStatusCard from '@/components/component_screens/dashboard/ResumeDailyStatusCard';
import WRText from '@/components/wrappers/Text';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import Emoji from '@/components/UI/emoji';

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  
  const screenStyle = StyleSheet.create({
    textGreetings: {
      marginVertical: 20,
      fontWeight: theme.fonts.semiBold.fontWeight,
      color: theme.colors.muted
    }
  });
  
  return (
    <WRScreenContainer>
      <WRText style={screenStyle.textGreetings}>
        Bom dia Victor! Que tal uma dose de <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>café</WRText> e <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>foco</WRText>? <Emoji name="hot-beverage" />
      </WRText>
      <ResumeDailyStatusCard />
    </WRScreenContainer>
  );
}