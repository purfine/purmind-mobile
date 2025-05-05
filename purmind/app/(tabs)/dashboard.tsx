import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import ResumeDailyStatusCard from '@/components/component_screens/dashboard/ResumeDailyStatusCard';
import WRText from '@/components/wrappers/Text';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  
  const screenStyle = StyleSheet.create({
    textGreetings: {
      marginVertical: 20,
      fontWeight: theme.fonts.semiBold.fontWeight,
      color: theme.colors.muted
    }
  });

  function Greetings(): JSX.Element {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <WRText style={screenStyle.textGreetings}>
          Bom dia Victor! Que tal uma dose de {' '}
          <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>café</WRText>
          {' '} e {' '}
          <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>foco</WRText>
          ? ☕
        </WRText>
      </View>
    );
  }
  
  return (
    <WRScreenContainer>
      <Greetings />
      <ResumeDailyStatusCard />
    </WRScreenContainer>
  );
}