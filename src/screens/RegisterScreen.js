import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {
    TextInput,
    Button,
    Title,
    HelperText,
    Menu,
    Divider,
} from 'react-native-paper';
import { saveData } from '../utils/storage';

// Validação CPF (algoritmo) — versão robusta
const isValidCPF = (cpf) => {
    const cleaned = (cpf || '').replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false; // todos iguais -> inválido

    // cálculo dígito 1
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
    }
    let rest = sum % 11;
    const digit1 = rest < 2 ? 0 : 11 - rest;
    if (digit1 !== parseInt(cleaned.charAt(9), 10)) return false;

    // cálculo dígito 2
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
    }
    rest = sum % 11;
    const digit2 = rest < 2 ? 0 : 11 - rest;
    if (digit2 !== parseInt(cleaned.charAt(10), 10)) return false;

    return true;
};

// Máscara CPF: 999.999.999-99
const formatCPF = (value) => {
    const d = (value || '').replace(/\D/g, '').slice(0, 11);
    let r = d;
    r = r.replace(/(\d{3})(\d)/, '$1.$2');
    r = r.replace(/(\d{3})(\d)/, '$1.$2');
    r = r.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return r;
};

// Máscara de celular/telefone: (99) 99999-9999 ou (99) 9999-9999
const formatPhone = (value) => {
    const d = (value || '').replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

// Validação de telefone celular/DDD: aceita 10 ou 11 dígitos (mais permissiva)
const isValidPhone = (phone) => {
    const cleaned = (phone || '').replace(/\D/g, '');
    // aceita 10 (fixo) ou 11 (celular) dígitos; evita começar com 0
    if (!(cleaned.length === 10 || cleaned.length === 11)) return false;
    if (/^0/.test(cleaned)) return false;
    return /^\d{10,11}$/.test(cleaned);
};

// Validação de e-mail simples
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleSelectCourse = (c) => {
        setCourse(c);
        if (errors.course) setErrors((s) => ({ ...s, course: null }));
        closeMenu();
    };

    const handleSave = async () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!isValidPhone(phone)) newErrors.phone = 'Telefone inválido (ex.: (11) 9xxxx-xxxx)';
        if (!isValidCPF(cpf)) newErrors.cpf = 'CPF inválido';
        if (!isValidEmail(email)) newErrors.email = 'E-mail inválido';
        if (!course) newErrors.course = 'Selecione um curso';
        if (!password || password.length < 4) newErrors.password = 'Senha obrigatória (mín. 4 caracteres)';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const user = { name, phone, cpf, email, course, password, username: email };
        await saveData('user', user);
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <Title style={styles.title}>Cadastrar Usuário</Title>

                <TextInput
                    label="Nome"
                    value={name}
                    onChangeText={(t) => {
                        setName(t);
                        if (errors.name) setErrors((s) => ({ ...s, name: null }));
                    }}
                    style={styles.input}
                    error={!!errors.name}
                />
                <HelperText type="error" visible={!!errors.name}>
                    {errors.name}
                </HelperText>

                <TextInput
                    label="Senha"
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t);
                        if (errors.password) setErrors((s) => ({ ...s, password: null }));
                    }}
                    secureTextEntry
                    style={styles.input}
                    error={!!errors.password}
                />
                <HelperText type="error" visible={!!errors.password}>
                    {errors.password}
                </HelperText>

                <TextInput
                    label="Telefone (celular)"
                    value={phone}
                    onChangeText={(t) => {
                        const masked = formatPhone(t);
                        setPhone(masked);
                        if (errors.phone) setErrors((s) => ({ ...s, phone: null }));
                    }}
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
                    onChangeText={(t) => {
                        const masked = formatCPF(t);
                        setCpf(masked);
                        if (errors.cpf) setErrors((s) => ({ ...s, cpf: null }));
                    }}
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
                    onChangeText={(t) => {
                        setEmail(t);
                        if (errors.email) setErrors((s) => ({ ...s, email: null }));
                    }}
                    style={styles.input}
                    keyboardType="email-address"
                    error={!!errors.email}
                    autoCapitalize="none"
                />
                <HelperText type="error" visible={!!errors.email}>
                    {errors.email}
                </HelperText>

                <View style={{ marginBottom: 4 }}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    openMenu();
                                }}
                            >
                                <TextInput
                                    label="Curso"
                                    value={course}
                                    style={[styles.input, { marginBottom: 0 }]}
                                    editable={false}
                                    right={
                                        <TextInput.Icon
                                            name="menu-down"
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                openMenu();
                                            }}
                                        />
                                    }
                                    error={!!errors.course}
                                />
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item onPress={() => handleSelectCourse('DSM')} title="DSM" />
                        <Divider />
                        <Menu.Item onPress={() => handleSelectCourse('ADS')} title="ADS" />
                        <Divider />
                        <Menu.Item onPress={() => handleSelectCourse('GRH')} title="GRH" />
                        <Divider />
                        <Menu.Item onPress={() => handleSelectCourse('GPI')} title="GPI" />
                    </Menu>

                    <HelperText type="info" visible={!course && !errors.course}>
                        Toque no campo ou no ícone para escolher o curso.
                    </HelperText>
                    <HelperText type="error" visible={!!errors.course}>
                        {errors.course}
                    </HelperText>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                >
                    Salvar
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#f5f0fa',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#222',
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
        backgroundColor: '#6d28d9',
        borderRadius: 6,
    },
});
