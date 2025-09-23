import React from 'react';
import { ScrollView, Image, StyleSheet, View } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

export default function DetailsScreen({ route }) {
    const { item } = route.params;
    const title = (item.title && (item.title.romaji || item.title.english || item.title.native)) || 'Sem título';

    return (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
            <Title>{title}</Title>
            <Image source={{ uri: item.coverImage?.large }} style={styles.cover} />
            <View style={{ marginTop: 12 }}>
                <Paragraph>Status: {item.status}</Paragraph>
                <Paragraph>Episódios: {item.episodes ?? 'N/A'}</Paragraph>
                <Paragraph>Pontuação média: {item.averageScore ?? 'N/A'}</Paragraph>
                <Paragraph style={{ marginTop: 12 }}>{item.description ? item.description.replace(/<[^>]+>/g, '') : 'Sem descrição'}</Paragraph>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    cover: { width: '100%', height: 350, borderRadius: 6, backgroundColor: '#ddd' }
});
