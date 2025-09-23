import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { searchAnime } from '../services/anilist';
import AnimeCard from '../components/AnimeCard';

export default function CardsScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);

    const handleAdd = async () => {
        try {
            const res = await searchAnime({ page: 1, perPage: 10, search: query });
            const newItems = res.media || [];
            setItems(prev => [...newItems, ...prev]);
        } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível buscar na AniList');
        }
    };

    const handleDelete = (id) => {
        setItems(prev => prev.filter(x => x.id !== id));
    };

    const handleDetails = (item) => {
        navigation.navigate('Details', { item });
    };

    return (
        <View style={styles.container}>
            <TextInput label="Buscar anime (nome)" value={query} onChangeText={setQuery} style={{ marginBottom: 8 }} />
            <Button mode="contained" onPress={handleAdd} style={{ marginBottom: 12 }}>ADD</Button>
            <FlatList
                data={items}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => (
                    <AnimeCard item={item} onDelete={() => handleDelete(item.id)} onDetails={() => handleDetails(item)} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 }
});
