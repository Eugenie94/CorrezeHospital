import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, KeyboardAvoidingView, Modal } from 'react-native';
import { Button } from 'react-native-paper';

export default function Profile ({setUserRole}) {

  const logout = async () => {
    try {
      // Clear user's data from AsyncStorage
      await AsyncStorage.removeItem('user');

      // Update the login state
      setUserRole();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Your existing components... */}
      
        <Button mode="contained" onPress={logout} style={{ marginTop: 10 }}>
          Logout
        </Button>
    </View>
  );
};


