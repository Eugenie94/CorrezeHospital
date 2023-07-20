import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function Form({ onSubmit }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleSubmit = () => {
    // Vérifier et valider les données du formulaire ici si nécessaire
    const formData = { name, age, specialty, treatment };
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nom"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        label="Âge"
        value={age}
        onChangeText={(text) => setAge(text)}
      />
      <TextInput
        label="Spécialité"
        value={specialty}
        onChangeText={(text) => setSpecialty(text)}
      />
      <TextInput
        label="Traitement en cours"
        value={treatment}
        onChangeText={(text) => setTreatment(text)}
      />
      <Button mode="contained" onPress={handleSubmit}>
        Valider
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});