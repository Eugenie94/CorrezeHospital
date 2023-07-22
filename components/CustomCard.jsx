import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Subheading, useTheme, Button } from 'react-native-paper';
import { IconButton } from 'react-native-paper';

export default function CustomCard({ role, name, age, taille, poids, treatment, email, mobile, onEdit, onDelete }) {
  const [userRole, setUserRole] = useState('');
  const theme = useTheme();

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
              <Subheading style={styles.treatmentDetail}>Médicament : {treatment.medicament}</Subheading>
              <Subheading style={styles.treatmentDetail}>Dosage par jour : {treatment.dosageParJour}</Subheading>
            </View>
          )}
        </>
      );
    } else if (role === 'medecin') { // Changed 'medecin' to 'doctor'
      return (
        <>
          {email && <Subheading>Email : {email}</Subheading>}
        </>
      );
    } else {
      return null;
    }
  };
  

  return (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Title style={{ color: theme.colors.primary }}>{name}</Title>
        {renderSpecificInfo()}
      </Card.Content>
      {userRole === 'admin' ? (
        <Card.Actions style={styles.cardActions}>
          {/* Utilisez IconButton au lieu de Button pour les icônes d'édition et de suppression */}
          <IconButton icon="pencil" size={20} onPress={() => onEdit()} />
          <IconButton icon="delete-outline" size={20} onPress={() => onDelete()} />
        </Card.Actions>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 4,
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
});