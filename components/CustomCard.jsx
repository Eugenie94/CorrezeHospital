import React, { useState } from 'react';
import { View, StyleSheet,  TouchableOpacity, Text } from 'react-native';
import { Card, Title, Subheading, useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import SendMessage from './SendMessage';
import CalendarMedecin from './CalendarMedecin';

export default function CustomCard({ role, name, age, taille, poids, treatment, email, mobile, onEdit, onDelete, userRole, onDeleteTreatment, onAddTreatment, patientId }) {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');

  const message = 'Bonjour, ceci est un SMS envoyé depuis mon application React Native !';

  // Fonction pour rendre les informations spécifiques en fonction du rôle (patient ou médecin)
  const renderSpecificInfo = () => {
    if (role === 'patient') {
      return (
        <>
          {age && <Subheading>Âge : {age}</Subheading>}
          {taille && <Subheading>Taille : {taille}</Subheading>}
          {poids && <Subheading>Poids : {poids}</Subheading>}
          {email && <Subheading>Email : {email}</Subheading>}
          {mobile && <Subheading>Mobile : {mobile}</Subheading>}
          {treatment && (
            <View style={styles.treatmentContainer}>
              <Subheading style={styles.treatmentTitle}>Traitement en cours :</Subheading>
              {treatment.map((item, index) => (
                <View key={index}>
                  <Subheading style={styles.treatmentDetail}>Médicament : {item.medicament}</Subheading>
                  <Subheading style={styles.treatmentDetail}>Dosage par jour : {item.dosageParJour}</Subheading>
                  {userRole === 'medecin' ? (
                    <>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDeleteTreatment(patientId, item._id)}
                      >
                        <Text style={styles.deleteButtonText}>Supprimer le traitement </Text> 
                      </TouchableOpacity>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          )}
          {userRole === 'medecin' ? (
            <>
              <TouchableOpacity style={styles.addButton} onPress={() => onAddTreatment(patientId)}>
                <Text style={styles.addButtonText}>Ajouter un traitement</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          {email && <Subheading>Email : {email}</Subheading>}
        </>
      );
    }
  };

  // Fonction pour gérer l'affichage/masquage du formulaire de calendrier
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title style={{ color: theme.colors.primary }}>{name}</Title>
        </View>
        {renderSpecificInfo()}
      </Card.Content>
      {/* Actions spécifiques selon le rôle de l'utilisateur */}
      {userRole === 'admin' ? (
        <Card.Actions style={styles.cardActions}>
          {/* Boutons pour éditer ou supprimer */}
          <IconButton icon="pencil" size={20} onPress={() => onEdit()} />
          <IconButton icon="delete-outline" size={20} onPress={() => onDelete()} />
        </Card.Actions>
      ) : userRole === 'medecin' && role === 'patient' ? (
        <Card.Actions style={styles.cardActions}>
          {/* Composant SendMessage pour envoyer un SMS */}
          <SendMessage mobile={mobile} message={message} />
          {/* Bouton pour afficher/masquer le formulaire de calendrier */}
          <IconButton icon="calendar" size={24} color="black" onPress={handleToggleForm} />
        </Card.Actions>
      ) : null}
      {/* Afficher le formulaire de calendrier si showForm est true */}
      {showForm && userRole === 'medecin' && role === 'patient' && (
        <CalendarMedecin
          visible={true}
          medecinConnecteName={name}
          patientMobile={mobile}
          medecinName="Dr. Dupont" 
        />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  // Styles pour le composant CustomCard
  cardContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  treatmentContainer: {
    marginTop: 8,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  treatmentDetail: {
    fontSize: 14,
    marginLeft: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
