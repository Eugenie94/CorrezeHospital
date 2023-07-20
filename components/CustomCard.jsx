// CustomCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomCard({ name, age, specialty, treatment }) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.name}>{name}</Text>
      {age && <Text style={styles.detail}>Âge : {age}</Text>}
      {specialty && <Text style={styles.detail}>Spécialité : {specialty}</Text>}
      {treatment && <Text style={styles.detail}>Traitement en cours : {treatment}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
});
