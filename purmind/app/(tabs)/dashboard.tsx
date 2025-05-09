import { StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import ResumeDailyStatusCard from '@/components/component_screens/dashboard/ResumeDailyStatusCard';
import WRScreenContainer from '@/components/wrappers/ScreenContainer';
import DailyBar from '@/components/component_screens/dashboard/DailyBar';
import Greetings from '@/components/component_screens/dashboard/Greetings';
import AppResumeCard from '@/components/component_screens/dashboard/AppsResumeCard';

export default function DashboardScreen() {
  const { theme } = useAppTheme();
  
  return (
    <WRScreenContainer>
      <Greetings userName="Victor" />
      <ResumeDailyStatusCard />
      <DailyBar />
      <AppResumeCard />
    </WRScreenContainer>
  );
}