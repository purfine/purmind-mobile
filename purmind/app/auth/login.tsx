import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace('/tabs/dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login: ' + error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Link href={"./register"} asChild>
        <Text style={{ marginTop: 15, color: 'blue' }}>Criar uma conta</Text>
      </Link>
    </View>
  );
}