import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Rh() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRhData, setNewRhData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });
  const [selectedRhData, setSelectedRhData] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer le rôle de l'utilisateur à partir du AsyncStorage
    const getRoleFromAsyncStorage = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson !== null) {
          const user = JSON.parse(userJson);
          setUserRole(user.role);
        } else {
          console.log('Aucune valeur pour la clé "user" dans AsyncStorage.');
        }
      } catch (error) {
        console.log('Erreur lors de la récupération de la valeur :', error);
      }
    };

    Axios.get('http://192.168.1.44:5000/api/rh')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });

    getRoleFromAsyncStorage(); // Appeler la fonction pour récupérer le rôle de l'utilisateur
  }, []);


  console.log('UserRole:', userRole);

  const handleAddRh = () => {
    Axios.post('http://192.168.1.44:5000/api/rh', newRhData)
      .then((response) => {
        console.log('Nouveau RH ajouté avec succès !');
        setShowAddModal(false);
        Axios.get('http://192.168.1.44:5000/api/rh')
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du nouveau RH :', error);
      });
  };

  const handleEditRh = (rhId, updatedData) => {
    const rhToUpdate = data.find((rh) => rh._id === rhId);
    if (rhToUpdate) {
      setSelectedRhData(rhToUpdate);
      setShowEditModal(true);
    }
  };

  const handleUpdateRh = () => {
    if (selectedRhData) {
      Axios.put(`http://192.168.1.44:5000/api/rh/${selectedRhData._id}`, selectedRhData)
        .then((response) => {
          setShowEditModal(false);
          Axios.get('http://192.168.1.44:5000/api/rh')
            .then((response) => {
              setData(response.data);
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des données :', error);
            });
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour du RH :', error);
        });
    }
  };

  const handleDeleteRh = (rhId) => {
    Axios.delete(`http://192.168.1.44:5000/api/rh/${rhId}`)
      .then((response) => {
        Axios.get('http://192.168.1.44:5000/api/rh')
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du RH :', error);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text>Aucun RH trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {userRole === 'admin' && ( // Condition pour afficher le bouton "Ajouter un RH" si vous êtes connecté en tant qu'administrateur
        <View style={styles.rhMessageContainer}>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Text style={styles.rhMessage}>Ajouter un RH</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ajouter un nouveau RH</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={newRhData.nom}
            onChangeText={(text) => setNewRhData({ ...newRhData, nom: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={newRhData.prenom}
            onChangeText={(text) => setNewRhData({ ...newRhData, prenom: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newRhData.email}
            onChangeText={(text) => setNewRhData({ ...newRhData, email: text })}
          />
          <Button title="Ajouter" onPress={handleAddRh} />
          <Button title="Annuler" onPress={() => setShowAddModal(false)} />
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Modifier le RH</Text>
          {/* Check if selectedRhData is not null before accessing its properties */}
          {selectedRhData && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={selectedRhData?.nom}
                onChangeText={(text) => setSelectedRhData({ ...selectedRhData, nom: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={selectedRhData?.prenom}
                onChangeText={(text) => setSelectedRhData({ ...selectedRhData, prenom: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={selectedRhData?.email}
                onChangeText={(text) => setSelectedRhData({ ...selectedRhData, email: text })}
                />
              </>
            )}
            <Button title="Modifier" onPress={handleUpdateRh} />
            <Button title="Annuler" onPress={() => setShowEditModal(false)} />
          </View>
        </Modal>
  
        <List.Section>
          {data.map((rh) => (
            <View key={rh._id}>
              <CustomCard
                role="rh"
                name={`${rh.nom} ${rh.prenom}`}
                email={rh.email}
                onEdit={() => handleEditRh(rh._id, { nom: rh.nom, prenom: rh.prenom, email: rh.email})}
                onDelete={() => handleDeleteRh(rh._id)}
                userRole={userRole} // Passer userRole en tant que prop
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
    adminText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 16,
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
    modalContainer: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 16,
    },
  });