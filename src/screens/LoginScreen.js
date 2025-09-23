import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { loadData } from '../utils/storage';

export default function LoginScreen({ navigation }) {
    const [userField, setUserField] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const stored = await loadData('user');

        if (!stored) {
            Alert.alert('Erro', 'Nenhum usuário cadastrado. Faça o cadastro primeiro.');
            return;
        }

        // Aqui estamos usando o email como "usuário"
        if (stored.username === userField && stored.password === password) {
            navigation.replace('Cards');
        } else {
            Alert.alert('Erro', 'Usuário ou senha incorretos.');
        }
    };

    return (
        <View style={styles.container}>
            <Title>Login</Title>
            <TextInput
                label="Usuário (email)"
                value={userField}
                onChangeText={setUserField}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 8 }}>
                Entrar
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Register')}>
                Cadastrar Usuário
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
    input: { marginBottom: 12 },
});
