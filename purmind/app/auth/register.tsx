import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function Register() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Tela de Cadastro</Text>
            <Link href={"./login"} asChild>
            <Text style={{ marginTop: 15, color: 'blue' }}>Já tenho uma conta</Text>
            </Link>
        </View>
    );
}