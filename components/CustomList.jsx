import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function CustomList() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get('http://10.74.3.67:5000/api/patient')
      .then((response) => {
        setPatients(response.data);
        // Do not set setLoading to false here
      })
      .catch((error) => {
        console.error('Error while fetching patients:', error);
        setLoading(false);
      });

    Axios.get('http://10.74.3.67:5000/api/medecin')
      .then((response) => {
        setDoctors(response.data);
        setLoading(false); // Set setLoading to false here, after both patients and doctors data are fetched
      })
      .catch((error) => {
        console.error('Error while fetching doctors:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        {data.map((item) => (
          <View key={item._id}>
            <CustomCard
              type={type}
              name={`${item.nom} ${item.prenom}`}
              age={item.age}
              specialty={item.specialty}
              treatment={item.traitement}
              email={item.email}
              password={item.password}
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
