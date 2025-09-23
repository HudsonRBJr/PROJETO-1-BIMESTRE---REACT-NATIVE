import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { loadData } from '../utils/storage';

export default function LoginScreen({ navigation }) {
    const [userField, setUserField] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const stored = await loadData('user');
        // validação simples: se existe usuário salvo, permite entrar
        if (stored) {
            navigation.replace('Cards');
        } else {
            navigation.navigate('Register');
        }
    };

    return (
        <View style={styles.container}>
            <Title>Login</Title>
            <TextInput label="Usuário" value={userField} onChangeText={setUserField} style={styles.input} />
            <TextInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 8 }}>Entrar</Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Register')}>Cadastrar Usuário</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
    input: { marginBottom: 12 },
});
