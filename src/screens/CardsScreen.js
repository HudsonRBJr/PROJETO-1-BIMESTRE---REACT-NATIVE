import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Title, Button, Paragraph, Divider } from 'react-native-paper';
import AnimeCard from '../components/AnimeCard';
import { loadData, saveData } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = 'savedAnimes';

export default function CardsScreen({ navigation }) {
    const [savedItems, setSavedItems] = useState([]);

    // Carrega os cards salvos do AsyncStorage
    const loadSaved = async () => {
        const saved = await loadData(STORAGE_KEY);
        if (saved && Array.isArray(saved)) setSavedItems(saved);
        else setSavedItems([]);
    };

    // Recarrega sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            loadSaved();
        }, [])
    );

    // Persistir sempre que mudar
    useEffect(() => {
        (async () => {
            await saveData(STORAGE_KEY, savedItems);
        })();
    }, [savedItems]);

    const handleDelete = (id) => {
        Alert.alert('Excluir', 'Deseja remover este card?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: () => {
                    setSavedItems((prev) => prev.filter((x) => x.id !== id));
                },
            },
        ]);
    };

    const handleDetails = (item) => {
        navigation.navigate('Details', { item });
    };

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 12 }}>
                <Title style={{ fontSize: 20 }}>Meus Cards</Title>
                <Paragraph style={{ marginBottom: 8 }}>
                    Aqui ficam somente os animes que você adicionou manualmente.
                </Paragraph>

                <Button mode="contained" onPress={() => navigation.navigate('Search')} style={{ marginBottom: 8 }}>
                    Buscar animes
                </Button>
            </View>

            <Divider />

            <View style={{ flex: 1, marginTop: 12 }}>
                {savedItems.length === 0 ? (
                    <Paragraph>Nenhum card adicionado. Toque em "Buscar animes" para adicionar.</Paragraph>
                ) : (
                    <FlatList
                        data={savedItems}
                        keyExtractor={(i) => String(i.id)}
                        renderItem={({ item }) => (
                            <AnimeCard item={item} onDelete={() => handleDelete(item.id)} onDetails={() => handleDetails(item)} />
                        )}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 },
});
