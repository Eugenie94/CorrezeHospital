import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Modal } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Register from './Register';

const Login = ({ setUserRole }) => {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  // Fonction pour afficher ou masquer la modal d'inscription
  const toggleRegisterModal = () => {
    setRegisterModalVisible(!registerModalVisible);
  };

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.92:5000/api/login', {
        email,
        password,
      });

      const { user } = response.data;

      try {
        // Stocker les données de l'utilisateur dans le stockage local (AsyncStorage)
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUserRole(user.role); // Appeler la fonction setUserRole pour définir le rôle de l'utilisateur dans l'application

        if (user.doctorId) {
          await AsyncStorage.setItem('doctorId', user.doctorId);
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
      }
      navigation.navigate('Accueil'); // Naviguer vers l'écran d'accueil après la connexion réussie

    } catch (error) {
      console.error(error);
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 25, textAlign: 'center' }}>Login</Text>
        <TextInput
          mode='outlined'
          label='Email'
          value={email}
          onChangeText={setEmail}
          style={{ marginVertical: 10 }}
        />
        <TextInput
          mode='outlined'
          label='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginVertical: 10 }}
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
        <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 10 }}>
          Log In
        </Button>
        <Button onPress={toggleRegisterModal} style={{ marginTop: 10 }}>
          Don't have an account? Sign up
        </Button>
      </View>
      {/* Modal pour l'inscription */}
      <Modal
        animationType="slide"
        visible={registerModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <Register closeModal={() => setRegisterModalVisible(false)} />
        <Button onPress={toggleRegisterModal} style={{ marginTop: 10 }}>
          Close
        </Button>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Login;
