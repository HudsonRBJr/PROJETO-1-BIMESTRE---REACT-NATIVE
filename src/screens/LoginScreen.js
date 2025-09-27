import React, { useState } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Card, Paragraph } from 'react-native-paper';
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
        if (stored.name === userField && stored.password === password) {
            navigation.replace('Cards');
        } else {
            Alert.alert('Erro', 'Usuário ou senha incorretos.');
        }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Login</Title>
          <Paragraph style={styles.subtitle}>
            Acesse com seu usuário e senha
          </Paragraph>

          <TextInput
            label="Usuário (Nome)"
            value={userField}
            onChangeText={setUserField}
            style={styles.input}
            autoCapitalize="none"
            mode="outlined"
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Entrar
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
          >
            Cadastrar Usuário
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#6c757d",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});
