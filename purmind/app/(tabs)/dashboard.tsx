import { StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import ResumeDailyStatusCard from '@/components/component_screens/dashboard/ResumeDailyStatusCard';
import WRText from '@/components/wrappers/Text';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import InlineEmojiText from '@/components/UI/InlineEmojiText';

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
      <InlineEmojiText
        emojiName="hot-beverage"
        emojiSize={18}
        textStyle={screenStyle.textGreetings}
      >
        Bom dia Victor! Que tal uma dose de <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>café</WRText> e <WRText style={{ color: theme.colors.primary, fontWeight: theme.fonts.bold.fontWeight }}>foco</WRText>?
      </InlineEmojiText>
      <ResumeDailyStatusCard />
    </WRScreenContainer>
  );
}