import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Divider, Text } from 'react-native-paper';
import { searchAnime } from '../services/anilist';
import { loadData, saveData } from '../utils/storage';

const STORAGE_KEY = 'savedAnimes';

function SearchResultItem({ item, onAdd, onDetails }) {
    const title = (item.title && (item.title.romaji || item.title.english || item.title.native)) || 'Sem título';
    const thumb = item.coverImage?.medium || item.coverImage?.large || item.coverImage?.extraLarge;

    return (
        <Card style={{ marginBottom: 10 }}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                {thumb ? (
                    <Image source={{ uri: thumb }} style={{ width: 80, height: 110, borderRadius: 6, marginRight: 12 }} />
                ) : (
                    <View style={{ width: 80, height: 110, backgroundColor: '#eee', marginRight: 12 }} />
                )}
                <View style={{ flex: 1 }}>
                    <Title style={{ fontSize: 16 }}>{title}</Title>
                    <Paragraph numberOfLines={2} ellipsizeMode="tail">
                        {item.description ? item.description.replace(/<[^>]+>/g, '') : ''}
                    </Paragraph>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <Text style={{ marginRight: 12 }}>Nota: {item.averageScore ?? 'N/A'}</Text>
                        <Text>Status: {item.status ?? '—'}</Text>
                    </View>
                </View>
            </Card.Content>

            <Card.Actions>
                <Button mode="contained" onPress={() => onAdd(item)}>Adicionar</Button>
                <Button onPress={() => onDetails(item)}>Ver detalhes</Button>
            </Card.Actions>
        </Card>
    );
}

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            Alert.alert('Busca', 'Digite um nome para buscar.');
            return;
        }
        try {
            setLoadingSearch(true);
            const res = await searchAnime({ page: 1, perPage: 20, search: query });
            const results = res.media || [];
            setSearchResults(results);
        } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível buscar na AniList');
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleAdd = async (anime) => {
        try {
            const saved = (await loadData(STORAGE_KEY)) || [];
            if (saved.some((a) => a.id === anime.id)) {
                Alert.alert('Já adicionado', 'Esse anime já está nos seus cards.');
                return;
            }
            const newSaved = [anime, ...saved];
            await saveData(STORAGE_KEY, newSaved);
            Alert.alert('Adicionado', 'Anime adicionado com sucesso aos seus cards.');
            // opcional: atualizar UI (não necessário, pois saved está no AsyncStorage e Cards screen recarrega ao voltar)
        } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível salvar o anime.');
        }
    };

    const handleDetails = (item) => {
        navigation.navigate('Details', { item });
    };

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 8 }}>
                <TextInput
                    label="Buscar anime (nome)"
                    value={query}
                    onChangeText={setQuery}
                    style={{ marginBottom: 8 }}
                    right={<TextInput.Icon name="magnify" onPress={handleSearch} />}
                    onSubmitEditing={handleSearch}
                />
                <Button mode="contained" onPress={handleSearch} loading={loadingSearch} style={{ marginBottom: 12 }}>
                    Buscar
                </Button>
                <Button mode="outlined" onPress={() => { setSearchResults([]); setQuery(''); }}>
                    Limpar resultados
                </Button>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={{ flex: 1 }}>
                {searchResults.length === 0 ? (
                    <Paragraph>Realize uma busca para ver resultados.</Paragraph>
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(i) => String(i.id)}
                        renderItem={({ item }) => (
                            <SearchResultItem item={item} onAdd={handleAdd} onDetails={handleDetails} />
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
