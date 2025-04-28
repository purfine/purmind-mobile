import BottomTab from '@/components/BottomTab';
import HeaderDashboard from '@/components/header/header_dashboard';
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <HeaderDashboard />
      <Text>Bem-vindo à Home!</Text>
      <BottomTab />
    </View>
  );
}
