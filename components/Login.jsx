import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    // Vérifier si les champs sont remplis
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setTimeout(() => {
        setError('');
      }, 2500);
      return;
    }

    try {
      // Faire la requête de connexion
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      console.log(response.data);

      // Récupérer les informations de l'utilisateur depuis la réponse
      const { user } = response.data;

      // Stocker l'état de connexion et les informations de l'utilisateur dans le AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(user));

      console.log(user.admin);
      if (user.admin) {
        // Stocker également l'état d'administrateur dans le AsyncStorage
        await AsyncStorage.setItem('isAdmin', 'true');
      } else {
        // Supprimer l'état d'administrateur du AsyncStorage s'il existe
        await AsyncStorage.removeItem('isAdmin');
      }

      // Redirection vers la page souhaitée après une connexion réussie
      navigation.navigate('Home');

    } catch (error) {
      console.error(error);
      // Affichage du message d'erreur
      setError("Échec de la connexion. Veuillez vérifier vos informations d'identification.");
      setTimeout(() => {
        setError('');
      }, 2500);
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Tu n'as pas de compte ? Inscris-toi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  linkText: {
    color: 'blue',
    fontSize: 14,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});