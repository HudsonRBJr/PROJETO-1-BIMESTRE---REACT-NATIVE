import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Button, Paragraph, Title } from 'react-native-paper';

export default function AnimeCard({ item, onDelete, onDetails }) {
    const title = (item.title && (item.title.romaji || item.title.english || item.title.native)) || 'Sem título';
    return (
        <Card style={{ marginBottom: 12 }}>
            <Card.Content style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.coverImage?.medium }} style={styles.thumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Title numberOfLines={2}>{title}</Title>
                    <Paragraph>Status: {item.status}</Paragraph>
                    <Paragraph>Score: {item.averageScore ?? 'N/A'}</Paragraph>
                </View>
            </Card.Content>
            <Card.Actions>
                <Button onPress={onDetails}>Ver mais detalhes</Button>
                <Button onPress={onDelete} mode="outlined">Excluir</Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    thumb: { width: 100, height: 140, borderRadius: 4, backgroundColor: '#eee' }
});
