import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, KeyboardAvoidingView, Modal } from 'react-native';
import { Button } from 'react-native-paper';

export default function Profile({ setUserRole }) {

  // Fonction de déconnexion (logout)
  const logout = async () => {
    try {
      // Supprimer les informations de l'utilisateur stockées en local
      await AsyncStorage.removeItem('user');

      // Appeler la fonction setUserRole pour réinitialiser le rôle de l'utilisateur (le déconnecter)
      setUserRole();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Bouton "Logout" qui appelle la fonction de déconnexion (logout) au clic */}
      <Button mode="contained" onPress={logout} style={{ marginTop: 10 }}>
        Logout
      </Button>
    </View>
  );
};
