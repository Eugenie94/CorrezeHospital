import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Doctor({userRole}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);

  // Fonction pour valider le format de l'email
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Récupération des données des médecins lors du chargement du composant
  useEffect(() => {
    Axios.get('http://192.168.1.92:5000/api/medecin')
      .then((response) => {
        const responseData = Array.isArray(response.data) ? response.data : Object.values(response.data);
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
  }, []);

  // Fonction pour ajouter un nouveau médecin
  const handleAddDoctor = () => {
    if (!validateEmail(newDoctorData.email)) {
      console.error('Invalid email format');
      return;
    }
    Axios.post('http://192.168.1.92:5000/api/medecin', newDoctorData)
      .then((response) => {
        console.log('Nouveau médecin ajouté avec succès !');
        setShowAddModal(false);
        // Mettre à jour la liste des médecins après l'ajout
        Axios.get('http://192.168.1.92:5000/api/medecin')
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

  // Fonction pour afficher le formulaire de modification du médecin
  const handleEditDoctor = (doctorId, updatedData) => {
    const doctorToUpdate = data.find((doctor) => doctor._id === doctorId);
    if (doctorToUpdate) {
      setSelectedDoctorData(doctorToUpdate);
      setShowEditModal(true);
    }
  };

  // Fonction pour mettre à jour le médecin
  const handleUpdateDoctor = () => {
    if (selectedDoctorData && !validateEmail(selectedDoctorData.email)) {
      console.error('Invalid email format');
      return;
    }
    if (selectedDoctorData) {
      Axios.put(`http://192.168.1.92:5000/api/medecin/${selectedDoctorData._id}`, selectedDoctorData)
        .then((response) => {
          console.log('Médecin mis à jour avec succès !');
          setShowEditModal(false);
          // Mettre à jour la liste des médecins après la mise à jour
          Axios.get('http://192.168.1.92:5000/api/medecin')
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

  // Fonction pour supprimer le médecin
  const handleDeleteDoctor = (doctorId) => {
    Axios.delete(`http://192.168.1.92:5000/api/medecin/${doctorId}`)
      .then((response) => {
        console.log('Médecin supprimé avec succès !');
        // Mettre à jour la liste des médecins après la suppression
        Axios.get('http://192.168.1.92:5000/api/medecin')
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

  // Afficher un indicateur de chargement lorsque les données sont en cours de récupération
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Afficher un message si aucune donnée de médecin n'est disponible
  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text>Aucun médecin trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.rhMessageContainer}>
        {/* Bouton pour afficher le formulaire d'ajout de médecin */}
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.rhMessage}>Ajouter un médecin</Text>
        </TouchableOpacity>
      </View>
      {/* Modal pour ajouter un nouveau médecin */}
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

      {/* Modal pour modifier le médecin */}
      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Modifier le médecin</Text>
          {/* Vérifier si selectedDoctorData n'est pas nul avant d'accéder à ses propriétés */}
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
        {/* Afficher chaque médecin dans une carte personnalisée */}
        {data.map((medecin) => (
          <View key={medecin._id}>
            <CustomCard
              role="medecin"
              name={`${medecin.nom} ${medecin.prenom}`}
              email={medecin.email}
              onEdit={() => handleEditDoctor(medecin._id, { nom: medecin.nom, prenom: medecin.prenom, email: medecin.email })}
              onDelete={() => handleDeleteDoctor(medecin._id)}
              userRole={userRole}
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
    backgroundColor: '#005EB8',
  },
  rhMessage: {
    color: '#FFFFFF',
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

