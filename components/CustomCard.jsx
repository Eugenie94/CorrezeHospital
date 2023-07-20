import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Subheading, useTheme } from 'react-native-paper';

export default function CustomCard({ role, name, age, specialty, treatment, email, password }) {
  const theme = useTheme();

  return (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Title style={{ color: theme.colors.primary }}>{name}</Title>
        {role === 'patient' && age && <Subheading>Âge : {age}</Subheading>}
        {role === 'doctor' && specialty && <Subheading>Spécialité : {specialty}</Subheading>}
        {role === 'patient' && treatment && (
          <View style={styles.treatmentContainer}>
            <Subheading style={styles.treatmentTitle}>Traitement en cours :</Subheading>
            <Subheading style={styles.treatmentDetail}>Médicament : {treatment.medicament}</Subheading>
            <Subheading style={styles.treatmentDetail}>Dosage par jour : {treatment.dosageParJour}</Subheading>
          </View>
        )}
        {role === 'doctor' && (
          <View style={styles.doctorDetails}>
            <Subheading style={styles.doctorDetail}>Email : {email}</Subheading>
            <Subheading style={styles.doctorDetail}>Password : {password}</Subheading>
          </View>
        )}
        {role === 'rh' && (
          <View style={styles.rhDetails}>
            <Subheading style={styles.rhDetail}>Email : {email}</Subheading>
            <Subheading style={styles.rhDetail}>Password : {password}</Subheading>
          </View>
        )}
      </Card.Content>
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
  doctorDetails: {
    marginTop: 8,
  },
  doctorDetail: {
    fontSize: 14,
  },
});