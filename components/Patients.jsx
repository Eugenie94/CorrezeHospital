import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Patient() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get('http://10.74.3.67:5000/api/patient')
      .then((response) => {
        const responseData = Array.isArray(response.data)
          ? response.data // Si c'est déjà un tableau, utilisez-le directement
          : Object.values(response.data); // Sinon, convertissez l'objet en tableau
  
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    // Afficher un indicateur de chargement si les données ne sont pas encore disponibles
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    // Afficher un message si aucune donnée n'a été trouvée
    return (
      <View style={styles.noDataContainer}>
        <Text>Aucun patient trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((patient) => (
          <View key={patient._id}>
<CustomCard
  type="patient"
  name={`${patient.nom} ${patient.prenom}`}
  age={patient.age}
  poids={patient.poids}
  taille={patient.taille}
  email={patient.email}
  mobile={patient.mobile}
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
