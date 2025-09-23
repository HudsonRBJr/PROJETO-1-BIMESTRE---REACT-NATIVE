import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { saveData } from '../utils/storage';

// função de validação de CPF
const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
};

// função de validação de telefone brasileiro simples
const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, ''); // só números
    return cleaned.length >= 10 && cleaned.length <= 11;
};

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');

    const [errors, setErrors] = useState({});

    const handleSave = async () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!isValidPhone(phone)) newErrors.phone = 'Telefone inválido';
        if (!isValidCPF(cpf)) newErrors.cpf = 'CPF inválido';
        if (!email.includes('@')) newErrors.email = 'E-mail inválido';
        if (!course.trim()) newErrors.course = 'Curso é obrigatório';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const user = { name, phone, cpf, email, course };
        await saveData('user', user);
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Title style={{ marginBottom: 12 }}>Cadastrar Usuário</Title>

            <TextInput
                label="Nome"
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
                {errors.name}
            </HelperText>

            <TextInput
                label="Telefone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                error={!!errors.phone}
            />
            <HelperText type="error" visible={!!errors.phone}>
                {errors.phone}
            </HelperText>

            <TextInput
                label="CPF"
                value={cpf}
                onChangeText={setCpf}
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.cpf}
            />
            <HelperText type="error" visible={!!errors.cpf}>
                {errors.cpf}
            </HelperText>

            <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
                {errors.email}
            </HelperText>

            <TextInput
                label="Curso"
                value={course}
                onChangeText={setCourse}
                style={styles.input}
                error={!!errors.course}
            />
            <HelperText type="error" visible={!!errors.course}>
                {errors.course}
            </HelperText>

            <Button mode="contained" onPress={handleSave}>
                Salvar
            </Button>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { marginBottom: 4 },
});
