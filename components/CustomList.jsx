// CustomList.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function CustomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend using Axios
    Axios.get('http://localhost:5000/api/patient')
      .then((response) => {
        setData(response.data); // Utilisez response.data pour mettre à jour les données
        setLoading(false); // Mettez fin au chargement après avoir récupéré les données
      })
      .catch((error) => {
        console.error('Error while fetching data:', error);
        setLoading(false); // Mettez fin au chargement en cas d'erreur
      });
  }, []);

  if (loading) {
    // Afficher un indicateur de chargement pendant que les données sont récupérées
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((patient) => (
          <View key={patient._id}>
            <CustomCard
              name={`${patient.nom} ${patient.prenom}`}
              age={patient.age}
              specialty={patient.specialty}
              treatment={patient.traitement}
            />
            <Divider />
          </View>
        ))}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
