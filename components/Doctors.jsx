import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Doctor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);

  const Role = async () => {
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
      return null;
    }
  };

  useEffect(() => {
    Axios.get('http://192.168.1.44:5000/api/medecin')
      .then((response) => {
        const responseData = Array.isArray(response.data) ? response.data : Object.values(response.data);
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
    Role();
  }, []);

  console.log('UserRole:', userRole);

  const handleAddDoctor = () => {
    Axios.post('http://192.168.1.44:5000/api/medecin', newDoctorData)
      .then((response) => {
        console.log('Nouveau médecin ajouté avec succès !');
        setShowAddModal(false);
        Axios.get('http://192.168.1.44:5000/api/medecin')
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du nouveau médecin :', error);
      });
  };

  const handleEditDoctor = (doctorId, updatedData) => {
    const doctorToUpdate = data.find((doctor) => doctor._id === doctorId);
    if (doctorToUpdate) {
      setSelectedDoctorData(doctorToUpdate);
      setShowEditModal(true);
    }
  };

  const handleUpdateDoctor = () => {
    if (selectedDoctorData) {
      Axios.put(`http://192.168.1.44:5000/api/medecin/${selectedDoctorData._id}`, selectedDoctorData)
        .then((response) => {
          console.log('Médecin mis à jour avec succès !');
          setShowEditModal(false);
          Axios.get('http://192.168.1.44:5000/api/medecin')
            .then((response) => {
              setData(response.data);
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des données :', error);
            });
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour du médecin :', error);
        });
    }
  };

  const handleDeleteDoctor = (doctorId) => {
    Axios.delete(`http://192.168.1.44:5000/api/medecin/${doctorId}`)
      .then((response) => {
        console.log('Médecin supprimé avec succès !');
        Axios.get('http://192.168.1.44:5000/api/medecin')
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données :', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression du médecin :', error);
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
        <Text>Aucun médecin trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
    {userRole === 'admin' ? (
      // Condition for displaying the "Add doctor" button
      <View style={styles.rhMessageContainer}>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.rhMessage}>Ajouter un médecin</Text>
        </TouchableOpacity>
      </View>
    ) : null}

      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ajouter un nouveau médecin</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={newDoctorData.nom}
            onChangeText={(text) => setNewDoctorData({ ...newDoctorData, nom: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={newDoctorData.prenom}
            onChangeText={(text) => setNewDoctorData({ ...newDoctorData, prenom: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newDoctorData.email}
            onChangeText={(text) => setNewDoctorData({ ...newDoctorData, email: text })}
          />
          <Button title="Ajouter" onPress={handleAddDoctor} />
          <Button title="Annuler" onPress={() => setShowAddModal(false)} />
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Modifier le médecin</Text>
          {/* Check if selectedDoctorData is not null before accessing its properties */}
          {selectedDoctorData && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={selectedDoctorData?.nom}
                onChangeText={(text) => setSelectedDoctorData({ ...selectedDoctorData, nom: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={selectedDoctorData?.prenom}
                onChangeText={(text) => setSelectedDoctorData({ ...selectedDoctorData, prenom: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={selectedDoctorData?.email}
                onChangeText={(text) => setSelectedDoctorData({ ...selectedDoctorData, email: text })}
              />
            </>
          )}
          <Button title="Modifier" onPress={handleUpdateDoctor} />
          <Button title="Annuler" onPress={() => setShowEditModal(false)} />
        </View>
      </Modal>
      <List.Section>
      {data.map((medecin) => (
        <View key={medecin._id}>
          <CustomCard
            role="medecin"
            name={`${medecin.nom} ${medecin.prenom}`}
            email={medecin.email}
            onEdit={() => handleEditDoctor(medecin._id, { nom: medecin.nom, prenom: medecin.prenom, email: medecin.email })}
            onDelete={() => handleDeleteDoctor(medecin._id)}
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
