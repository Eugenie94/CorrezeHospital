import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomCard({ name, age, treatment }) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.name}>{name}</Text>
      {age && <Text style={styles.detail}>Âge : {age}</Text>}
      {treatment && (
        <View style={styles.treatmentContainer}>
          <Text style={styles.treatmentTitle}>Traitement en cours :</Text>
          <Text style={styles.treatmentDetail}>Médicament : {treatment.medicament}</Text>
          <Text style={styles.treatmentDetail}>Dosage par jour : {treatment.dosageParJour}</Text>
        </View>
      )}
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
  treatmentContainer: {
    marginTop: 8,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  treatmentDetail: {
    fontSize: 14,
    marginLeft: 8,
  },
});
