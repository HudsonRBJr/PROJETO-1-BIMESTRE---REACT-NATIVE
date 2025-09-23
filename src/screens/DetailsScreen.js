import React from 'react';
import {
    ScrollView,
    View,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import { Title, Paragraph, Card, Text, IconButton } from 'react-native-paper';

const youtubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
const dailymotionWatchUrl = (id) => `https://www.dailymotion.com/video/${id}`;

// fallback: if AniList provides trailer.thumbnail use it,
// otherwise, if trailer.site === 'youtube' build a youtube thumbnail URL.
const getTrailerThumbnail = (trailer) => {
    if (!trailer) return null;
    if (trailer.thumbnail) return trailer.thumbnail;
    if (trailer.site === 'youtube' && trailer.id) {
        return `https://img.youtube.com/vi/${trailer.id}/hqdefault.jpg`;
    }
    return null;
};

const openTrailer = async (trailer) => {
    if (!trailer) {
        Alert.alert('Trailer', 'Trailer não disponível.');
        return;
    }
    let url = null;
    if (trailer.site === 'youtube' && trailer.id) url = youtubeWatchUrl(trailer.id);
    else if (trailer.site === 'dailymotion' && trailer.id) url = dailymotionWatchUrl(trailer.id);
    // if AniList provides direct URL in streamingEpisodes or elsewhere you could use it
    if (!url && trailer.id && trailer.site) {
        // fallback attempt: try YouTube style or just alert
        url = youtubeWatchUrl(trailer.id);
    }
    if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            Linking.openURL(url);
        } else {
            Alert.alert('Erro', 'Não foi possível abrir o trailer.');
        }
    } else {
        Alert.alert('Trailer', 'Trailer não disponível.');
    }
};

export default function DetailsScreen({ route }) {
    const { item } = route.params;
    const title = (item.title && (item.title.romaji || item.title.english || item.title.native)) || 'Sem título';
    const banner = item.bannerImage;
    const cover = item.coverImage?.extraLarge || item.coverImage?.large || item.coverImage?.medium;
    const trailerThumb = getTrailerThumbnail(item.trailer);
    const episodes = item.streamingEpisodes || []; // pode ser vazio
    const score = item.averageScore;

    return (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
            {banner ? (
                <Image source={{ uri: banner }} style={styles.banner} resizeMode="cover" />
            ) : null}

            <View style={{ marginTop: 12, alignItems: 'center' }}>
                {cover ? (
                    <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
                ) : null}
            </View>

            <View style={{ marginTop: 12 }}>
                <Title>{title}</Title>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ marginRight: 12 }}>Nota média: {score ?? 'N/A'}</Text>
                    {item.status ? <Text>Status: {item.status}</Text> : null}
                    {item.episodes ? <Text style={{ marginLeft: 12 }}>Eps: {item.episodes}</Text> : null}
                </View>

                <Paragraph style={{ marginTop: 12 }}>
                    {item.description ? item.description.replace(/<[^>]+>/g, '') : 'Sem descrição disponível.'}
                </Paragraph>

                {/* Trailer thumbnail + play */}
                {item.trailer ? (
                    <Card style={{ marginTop: 12 }}>
                        <Card.Title title="Trailer" />
                        <Card.Content>
                            {trailerThumb ? (
                                <TouchableOpacity onPress={() => openTrailer(item.trailer)}>
                                    <Image source={{ uri: trailerThumb }} style={styles.trailerThumb} />
                                    <IconButton
                                        icon="play-circle"
                                        size={48}
                                        style={styles.playIcon}
                                        onPress={() => openTrailer(item.trailer)}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <Paragraph>Trailer disponível, mas sem thumbnail.</Paragraph>
                            )}
                        </Card.Content>
                    </Card>
                ) : null}

                {/* Episódios com thumbnails (se houver) */}
                <View style={{ marginTop: 12 }}>
                    <Title style={{ fontSize: 18 }}>Episódios</Title>
                    {episodes.length === 0 ? (
                        <Paragraph>Lista de episódios não disponível pela API.</Paragraph>
                    ) : (
                        <FlatList
                            data={episodes}
                            horizontal
                            keyExtractor={(ep, idx) => `${ep.title ?? 'ep'}-${idx}`}
                            renderItem={({ item: ep }) => (
                                <TouchableOpacity
                                    style={styles.episodeCard}
                                    onPress={() => {
                                        // se existir url para assistir, abrir
                                        const url = ep.url;
                                        if (url) Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o link'));
                                        else Alert.alert('Episódio', ep.title || 'Sem título');
                                    }}
                                >
                                    {ep.thumbnail ? (
                                        <Image source={{ uri: ep.thumbnail }} style={styles.episodeThumb} />
                                    ) : (
                                        <View style={[styles.episodeThumb, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text>Sem thumbnail</Text>
                                        </View>
                                    )}
                                    <Text numberOfLines={2} style={{ width: 120, marginTop: 6 }}>
                                        {ep.title || 'Sem título'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    banner: { width: '100%', height: 180, borderRadius: 6, backgroundColor: '#333' },
    cover: { width: 220, height: 320, borderRadius: 6 },
    trailerThumb: { width: '100%', height: 200, borderRadius: 6, backgroundColor: '#000' },
    playIcon: { position: 'absolute', left: '42%', top: '38%', backgroundColor: 'transparent' },
    episodeCard: { marginRight: 12, width: 140 },
    episodeThumb: { width: 140, height: 80, borderRadius: 6, backgroundColor: '#ddd' },
});
