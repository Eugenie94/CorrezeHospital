import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Patient({userRole}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [newMedicament, setNewMedicament] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [newPatientData, setNewPatientData] = useState({
        nom: '',
        prenom: '',
        age: '',
        poids: '',
        taille: '',
        email: '',
        mobile: '',
        traitement: [],
        
    });
    const [selectedPatientData, setSelectedPatientData] = useState(null);


    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
      };

    useEffect(() => {
        Axios.get('http://192.168.1.44:5000/api/patient')
            .then((response) => {
                const responseData = Array.isArray(response.data)
                    ? response.data
                    : Object.values(response.data);
                setData(responseData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des données :', error);
                setLoading(false);
            });

    }, []);

    useEffect(() => {
    }, []);


    const handleAddPatient = () => {
        if (!validateEmail(newPatientData.email)) {
            console.error('Invalid email format');
            return;
          }
        // Envoyer les données du nouveau patient au backend pour l'ajouter dans la base de données
        Axios.post('http://192.168.1.44:5000/api/patient', newPatientData)
            .then((response) => {
                console.log('Nouveau patient ajouté avec succès !');
                // Fermer la modal après avoir ajouté le patient
                setShowAddModal(false);
                // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                Axios.get('http://192.168.1.44:5000/api/patient')
                    .then((response) => {
                        const responseData = Array.isArray(response.data)
                            ? response.data
                            : Object.values(response.data);
                        setData(responseData);
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la récupération des données :', error);
                    });
            })
            .catch((error) => {
                console.error('Erreur lors de l\'ajout du nouveau patient :', error);
                // Afficher un message d'erreur ou effectuer toute autre action en cas d'échec de l'ajout
            });
    };

    const handleEditPatient = (patientId, updatedData) => {
        // Récupérer les données du patient que vous souhaitez modifier en utilisant l'ID du patient
        const patientToUpdate = data.find((patient) => patient._id === patientId);
        if (patientToUpdate) {
            // Mettre à jour l'état selectedPatientData avec les données du patient sélectionné
            setSelectedPatientData(patientToUpdate);
            // Ouvrir la modal de modification
            setShowEditModal(true);
        }
    };

    const handleUpdatePatient = () => {
        if (selectedPatientData && !validateEmail(selectedPatientData.email)) {
            console.error('Invalid email format');
            return;
          }
        if (selectedPatientData) {
            // Envoyer les données mises à jour au backend pour modifier le patient dans la base de données
            Axios.put(`http://192.168.1.44:5000/api/patient/${selectedPatientData._id}`, selectedPatientData)
                .then((response) => {
                    console.log('Patient mis à jour avec succès !');
                    // Fermer la modal après avoir mis à jour le patient
                    setShowEditModal(false);
                    // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                    Axios.get('http://192.168.1.44:5000/api/patient')
                        .then((response) => {
                            const responseData = Array.isArray(response.data)
                                ? response.data
                                : Object.values(response.data);
                            setData(responseData);
                        })
                        .catch((error) => {
                            console.error('Erreur lors de la récupération des données :', error);
                        });
                })
                .catch((error) => {
                    console.error('Erreur lors de la mise à jour du patient :', error);
                    // Afficher un message d'erreur ou effectuer toute autre action en cas d'échec de la mise à jour
                });
        }
    };

    const handleDeletePatient = (patientId) => {
        // Envoyer la demande de suppression au backend
        Axios.delete(`http://192.168.1.44:5000/api/patient/${patientId}`)
            .then((response) => {
                console.log('Patient supprimé avec succès !');
                // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                Axios.get('http://192.168.1.44:5000/api/patient')
                    .then((response) => {
                        const responseData = Array.isArray(response.data)
                            ? response.data
                            : Object.values(response.data);
                        setData(responseData);
                    })
                    .catch((error) => {
                        console.error('Erreur lors de la récupération des données :', error);
                    });
            })
            .catch((error) => {
                console.error('Erreur lors de la suppression du patient :', error);
                // Afficher un message d'erreur ou effectuer toute autre action en cas d'échec de la suppression
            });
    };

    const handleAddTreatment = () => {
        // Vérifier si les champs du médicament et du dosage sont remplis
        if (newMedicament.trim() === '' || newDosage.trim() === '') {
          console.error('Veuillez remplir tous les champs du traitement.');
          return;
        }
    
        const newTreatment = {
          medicament: newMedicament,
          dosageParJour: parseInt(newDosage),
        };
        
    
        Axios.post(`http://192.168.1.44:5000/api/patient/${selectedPatientId}/add-treatment`, newTreatment)
          .then((response) => {
            console.log('Traitement ajouté avec succès !');
            Axios.get(`http://192.168.1.44:5000/api/patient/${selectedPatientId}`)
                .then((response) => {
                    const updatedPatientData = response.data;
                    const patientIndex = data.findIndex((patient) => patient._id === selectedPatientId);
                    if (patientIndex !== -1) {
                        const updatedData = [...data];
                        updatedData[patientIndex] = updatedPatientData;
                        setData(updatedData);
                    }
                    handleCloseModal(); 
                })
        })
          .catch((error) => {
            console.error('Erreur lors de l\'ajout du traitement :', error);
          });
    
        // Réinitialiser les valeurs des champs de saisie
        setNewMedicament('');
        setNewDosage('');
      };



      const handleDeleteTreatment = (patientId, treatmentId) => {
        const patientIndex = data.findIndex((patient) => patient._id === patientId);
      
        if (patientIndex === -1) {
          console.error('Patient non trouvé');
          return;
        }
      
        const updatedPatients = [...data];
        const patient = updatedPatients[patientIndex];
      
        // Filtrer le traitement en fonction de son ID
        patient.traitement = patient.traitement.filter((treatment) => treatment._id !== treatmentId);
      
        Axios.put(`http://192.168.1.44:5000/api/patient/${patientId}`, patient)
          .then((response) => {
            console.log('Traitement supprimé avec succès !');
            setData(updatedPatients); // Mettre à jour la liste des patients avec le traitement supprimé
          })
          .catch((error) => {
            console.error('Erreur lors de la suppression du traitement :', error);
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
                <Text>Aucun patient trouvé.</Text>
            </View>
        );
    }

    const handleOpenModal = (patientId) => {
        setSelectedPatientId(patientId);
        setShowTreatmentModal(true);
      };
      

  const handleCloseModal = () => {
    setShowTreatmentModal(false);
  };

    return (
        <ScrollView style={styles.container}>
            {userRole === 'admin' || userRole === 'rh' ? ( // Condition for displaying the "Add patient" button
                <View style={styles.rhMessageContainer}>
                    <TouchableOpacity onPress={() => setShowAddModal(true)}>
                        <Text style={styles.rhMessage}>Ajouter un patient</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <Modal visible={showAddModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Ajouter un nouveau patient</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={newPatientData.nom}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, nom: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Prénom"
                        value={newPatientData.prenom}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, prenom: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Âge"
                        keyboardType="numeric"
                        value={newPatientData.age}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, age: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Poids"
                        keyboardType="numeric"
                        value={newPatientData.poids}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, poids: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Taille"
                        keyboardType="numeric"
                        value={newPatientData.taille}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, taille: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={newPatientData.email}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, email: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile"
                        value={newPatientData.mobile}
                        onChangeText={(text) => setNewPatientData({ ...newPatientData, mobile: text })}
                    />
                    <Button title="Ajouter" onPress={handleAddPatient} />
                    <Button title="Annuler" onPress={() => setShowAddModal(false)} />
                </View>
            </Modal>

            <Modal visible={showEditModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Modifier le patient</Text>
                    {/* Check if selectedPatientData is not null before accessing its properties */}
                    {selectedPatientData && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom"
                                value={selectedPatientData?.nom}
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, nom: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Prénom"
                                value={selectedPatientData?.prenom}
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, prenom: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Âge"
                                keyboardType="numeric"
                                value={selectedPatientData?.age.toString()} // Convert age to string
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, age: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Taille"
                                keyboardType="numeric"
                                value={selectedPatientData?.taille.toString()} // Convert taille to string
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, taille: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Poids"
                                keyboardType="numeric"
                                value={selectedPatientData?.poids.toString()} // Convert poids to string
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, poids: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={selectedPatientData?.email}
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, email: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile"
                                value={selectedPatientData?.mobile}
                                onChangeText={(text) => setSelectedPatientData({ ...selectedPatientData, mobile: text })}
                            />
                        </>
                    )}
                    <Button title="Modifier" onPress={handleUpdatePatient} />
                    <Button title="Annuler" onPress={() => setShowEditModal(false)} />
                </View>
            </Modal>

             {/* Modal pour ajouter un traitement */}
             <Modal visible={showTreatmentModal} animationType="slide">
                <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Ajouter un nouveau traitement</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom du médicament"
                    value={newMedicament}
                    onChangeText={(text) => setNewMedicament(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dosage par jour"
                    value={newDosage}
                    onChangeText={(text) => setNewDosage(text)}
                    keyboardType="numeric"
                />
                <Button title="Ajouter" onPress={handleAddTreatment} />
                <Button title="Annuler" onPress={handleCloseModal} />
                </View>
            </Modal>

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
                            onEdit={() => handleEditPatient(patient._id, { /* les données mises à jour du patient */ })}
                            onDelete={() => handleDeletePatient(patient._id)}
                            userRole={userRole} // Passer userRole en tant que prop
                             //traitements
                             onAddTreatment={() => handleOpenModal(patient._id)}
                             onDeleteTreatment={(patientId, treatmentId) => handleDeleteTreatment(patientId, treatmentId)} 
                             patientId={patient._id} 
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