import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function CustomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('patient'); // Set the default type to 'patient'

  useEffect(() => {
    // Fetch data based on the type ('patient' or 'doctor')
    const fetchData = async () => {
      try {
        setLoading(true);
        if (type === 'patient') {
          const response = await Axios.get('http://10.74.3.67:5000/api/patient');
          setData(response.data);
        } else if (type === 'doctor') {
          const response = await Axios.get('http://10.74.3.67:5000/api/medecin');
          setData(response.data);
        } else if (type === 'rh') {
          const response = await Axios.get('http://10.74.3.67:5000/api/rh');
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error while fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

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
