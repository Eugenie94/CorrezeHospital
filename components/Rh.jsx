import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Rh() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get('http://10.74.3.67:5000/api/rh')
      .then((response) => {
        setData(response.data);
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
        <Text>Aucun rh trouvé.</Text>
      </View>
    );
  }
console.log(Rh.password)
  return (
    <ScrollView style={styles.container}>
      <List.Section>
        {data.map((rh) => (
          <View key={rh._id}>
            <CustomCard
              type="rh"
              name={`${rh.nom} ${rh.prenom}`}
              email={`${rh.email}`}
              password={`${rh.password}`}
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
