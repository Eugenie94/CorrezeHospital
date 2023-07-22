import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Subheading, useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import SendMessage from './SendMessage';
import CalendarMedecin from './CalendarMedecin';

export default function CustomCard({ role, name, age, taille, poids, treatment, email, mobile, onEdit, onDelete, userRole }) {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);

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
    } else {
      return (
        <>
          {email && <Subheading>Email : {email}</Subheading>}
        </>
      )
    }
  };

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
      {userRole === 'admin' ? (
        <Card.Actions style={styles.cardActions}>
          <IconButton icon="pencil" size={20} onPress={() => onEdit()} />
          <IconButton icon="delete-outline" size={20} onPress={() => onDelete()} />
        </Card.Actions>
      ) : userRole === 'medecin' && role === 'patient' ? (
        <Card.Actions style={styles.cardActions}>
          <SendMessage mobile={mobile} />
          <IconButton icon="calendar" size={24} color="black" onPress={handleToggleForm} />
        </Card.Actions>
      ) : null}
      {showForm && userRole === 'medecin' && role === 'patient' && (
        <CalendarMedecin />
      )}
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
});
