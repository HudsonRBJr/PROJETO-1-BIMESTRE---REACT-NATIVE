# PROJETO-1-BIMESTRE---REACT-NATIVE

👨‍💻 Grupo: <br>
Hudson Ribeiro Barbara Junior <br>
Gabriel Andrade Aleixo

API escolhida: AniList

Este projeto é um **aplicativo mobile** desenvolvido em **React Native** usando **Expo**, que consome a **AniList API** para fornecer informações detalhadas sobre **animes e mangás**.  
O app exibe sinopses, pontuações, gêneros, status, imagens e muito mais, funcionando como uma ferramenta de consulta rápida para dispositivos móveis.





---

## ⚙️ Funcionalidades

- 🔎 Buscar informações de animes e mangás.  
- 📖 Exibir título, imagem e dados básicos de cada anime.  
- 👤 Criar conta com dados validados (nome, CPF, telefone, e-mail, curso e senha).  
- 🔐 Login e autenticação de usuário.  
- 💾 Armazenamento local com **AsyncStorage**.  


---

## Tecnologias Utilizadas

- **React Native** – framework mobile multiplataforma.
- **Expo** – ambiente de desenvolvimento e teste.
- **Axios** – requisições HTTP à API da Anilist.
- **GraphQL** – consultas à Anilist API.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)  
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)  
- [Expo CLI](https://docs.expo.dev/get-started/installation/)  
- Celular com **Expo Go** ou emulador Android/iOS

---

## Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/HudsonRBJr/PROJETO-1-BIMESTRE---REACT-NATIVE.git
cd PROJETO-1-BIMESTRE---REACT-NATIVE

```
2. Instale as dependencias:

```bash
npm install
# ou
yarn install
```
3. Corrija dependências nativas com o Expo:
  ```bash
    expo install --fix
  ``` 

4. Inicie o projeto com expo:
```bash

npx expo start
```
5. Abra o app no dispositivo ou emulador:

No celular: abra o Expo Go e escaneie o QR code.

No emulador: siga as instruções do Expo para Android ou iOS.

## Estrutura do Projeto
```bash
PROJETO-1-BIM
├── assets/                # Imagens e ícones usados no projeto
│   ├── adaptive-icon.png   
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/                   # Código-fonte do aplicativo
│   ├── components/        # Componentes reutilizáveis
│   ├── screens/           # Telas do aplicativo
│   │   ├── CardsScreen.js
│   │   ├── DetailsScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── SearchScreen.js
│   ├── services/          # Serviços como chamadas API ou outros utilitários
│   ├── utils/             # Funções auxiliares e utilitários
│   ├── App.js             # Componente raiz do aplicativo
│   ├── app.json           # Configurações do app
│   ├── index.js           # Ponto de entrada do aplicativo
│   └── package-lock.json  # Versões exatas das dependências
├── .gitignore             # Arquivo para ignorar arquivos durante o versionamento
├── README.md              # Documentação do projeto
├── package.json           # Dependências e scripts do projeto
└── package-lock.json      # Bloqueia as versões das dependências

```

## Exemplo de Função:

###  tela de login
A tela de login permite que o usuário insira seu nome de usuário (e-mail) e senha para acessar o aplicativo. Caso as credenciais sejam válidas, o usuário será redirecionado para a tela de Cards.

Funções Principais:

useState: Usado para armazenar os valores dos campos de usuário e senha.

handleLogin: Função que valida as credenciais do usuário, comparando com os dados armazenados localmente. Caso os dados estejam corretos, o usuário é redirecionado para a tela de Cards.

TextInput: Componente utilizado para capturar as informações inseridas pelo usuário.

Button: O botão de login executa a função handleLogin, enquanto o botão de cadastro redireciona para a tela de registro.

Exemplo de código: LoginScreen.js:

```bash
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
            label="Usuário (email)"
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


```

1. Explicação do Código: <br>
    useState: O hook useState é utilizado para gerenciar os valores de entrada dos campos de "Usuário" (e-mail) e "Senha".

   ```bash
    const [userField, setUserField] = useState('');
    const [password, setPassword] = useState('');

   ```

2. handleLogin: A função handleLogin é responsável por validar as credenciais do usuário. Ela verifica se os dados fornecidos (nome de usuário e senha) correspondem aos dados armazenados localmente.
```bash
const handleLogin = async () => {
  const stored = await loadData('user');
  
  if (!stored) {
    Alert.alert('Erro', 'Nenhum usuário cadastrado. Faça o cadastro primeiro.');
    return;
  }
  
  if (stored.name === userField && stored.password === password) {
      navigation.replace('Cards');
  } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
  }
};

```
   
3. TextInput: Usado para capturar as informações inseridas pelo usuário, como o e-mail e a senha.
   ```bash
    <TextInput
    label="Usuário (email)"
    value={userField}
    onChangeText={setUserField}
    style={styles.input}
    autoCapitalize="none"
    mode="outlined"
    />

   ```

4. Button: O primeiro botão chama a função handleLogin quando pressionado, enquanto o segundo redireciona o usuário para a tela de cadastro.
   ```bash
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

   ```


## 🌐 Consumo da API AniList

Na tela Cards, o projeto consome dados da AniList API via GraphQL.

```bash
query {
  Page(perPage: 10) {
    media(type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
    }
  }
}

```

## ✅ Validações Implementadas
CPF válido (cálculo de dígitos verificadores).

Telefone formatado: (XX) XXXXX-XXXX.

E-mail válido.

Senha mínima de 4 caracteres.


## Contribuições

Se você deseja contribuir para este projeto, sinta-se à vontade para fazer um fork e criar um pull request. Será um prazer revisar suas contribuições!


## Licença

Este projeto está licenciado sob a **Licença MIT**.  

Isso significa que você pode:  
- Usar o código em projetos pessoais e comerciais.  
- Modificar, distribuir e compartilhar livremente.  
- Incorporar em outros softwares, inclusive proprietários.  

A única exigência é **manter o aviso de copyright e a licença MIT** em qualquer cópia ou parte substancial do código.  

> Em resumo: você pode usar, copiar e alterar como quiser, mas precisa dar os devidos créditos.



