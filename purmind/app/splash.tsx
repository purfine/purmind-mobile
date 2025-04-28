import { View, Text, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginTop: 20 }}>Subindo aplicativo...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}