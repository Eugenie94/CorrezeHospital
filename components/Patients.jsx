import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomCard from './CustomCard';
import Axios from 'axios';

export default function Patient() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newPatientData, setNewPatientData] = useState({
        nom: '',
        prenom: '',
        age: '',
        poids: '',
        taille: '',
        email: '',
        mobile: '',
        traitement: [
            {
                "medicament": "",
                "dosageParJour": 3
            },
            {
                "medicament": "",
                "dosageParJour": 4
            }
        ]
    });
    const [selectedPatientData, setSelectedPatientData] = useState(null);

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
        Axios.get('http://192.168.1.92:5000/api/patient')
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
        Role(); // Appeler Role ici pour mettre à jour la valeur de userRole
    }, []);

    useEffect(() => {
        Role();
    }, []);

    console.log('UserRole:', userRole); // Vérifiez la valeur de userRole ici

    const handleAddPatient = () => {
        // Envoyer les données du nouveau patient au backend pour l'ajouter dans la base de données
        Axios.post('http://192.168.1.92:5000/api/patient', newPatientData)
            .then((response) => {
                console.log('Nouveau patient ajouté avec succès !');
                // Fermer la modal après avoir ajouté le patient
                setShowAddModal(false);
                // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                Axios.get('http://192.168.1.92:5000/api/patient')
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
        // Vérifier si selectedPatientData n'est pas null
        if (selectedPatientData) {
            // Envoyer les données mises à jour au backend pour modifier le patient dans la base de données
            Axios.put(`http://192.168.1.92:5000/api/patient/${selectedPatientData._id}`, selectedPatientData)
                .then((response) => {
                    console.log('Patient mis à jour avec succès !');
                    // Fermer la modal après avoir mis à jour le patient
                    setShowEditModal(false);
                    // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                    Axios.get('http://192.168.1.92:5000/api/patient')
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
        Axios.delete(`http://192.168.1.92:5000/api/patient/${patientId}`)
            .then((response) => {
                console.log('Patient supprimé avec succès !');
                // Rafraîchir la liste des patients en rechargeant les données depuis le backend
                Axios.get('http://192.168.1.92:5000/api/patient')
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
                    <TextInput
                        style={styles.input}
                        placeholder="Traitement en cours"
                        value={
                            typeof newPatientData.traitement === 'string'
                                ? newPatientData.traitement // Utiliser la chaîne JSON si elle est déjà au bon format
                                : JSON.stringify(newPatientData.traitement) // Convertir l'objet en chaîne JSON
                        }
                        onChangeText={(text) => {
                            try {
                                setNewPatientData({ ...newPatientData, traitement: JSON.parse(text) }); // Reconvertir la chaîne en objet JSON
                            } catch (error) {
                                // Gérer les erreurs d'analyse JSON si nécessaire
                                console.error('Erreur lors de la conversion JSON :', error);
                            }
                        }}
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