import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Patient() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(''); // Ajout du state pour le rôle de l'utilisateur

    const Role = async () => {
        try {
          const userJson = await AsyncStorage.getItem('user');
          if (userJson !== null) {
            const user = JSON.parse(userJson);
            setUserRole(user.role)       
          } else {
            console.log('Aucune valeur pour la clé "user" dans AsyncStorage.');
          }
        } catch (error) {
          console.log('Erreur lors de la récupération de la valeur :', error);
          return null
        }
      };


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
    },);


    useEffect(() => {
        // Ici, vous pouvez définir le rôle de l'utilisateur une fois qu'il est connecté
        Role();
    },);
    
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
            {userRole=== 'rh' ? ( // Utilisez un opérateur ternaire pour afficher le message uniquement si l'utilisateur est connecté en tant que "rh"
                <View style={styles.rhMessageContainer}>
                    <Text style={styles.rhMessage}>
                        Je suis un RH et je peux ajouter un patient.
                    </Text>
                </View>
            ) : null}
            <List.Section>
                {data.map((patient) => (
                    <View key={patient._id}>
                        <CustomCard
                            role="patient"
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
    rhMessageContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#005EB8', // Couleur d'arrière-plan pour le message RH
    },
    rhMessage: {
        color: '#FFFFFF', // Couleur du texte pour le message RH
        textAlign: 'center',
    },
});