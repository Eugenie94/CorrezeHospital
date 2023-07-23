import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Modal } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
 // Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Register from './Register';

const Login = ({setUserRole} ) => {
  const navigation = useNavigation(); // Use the useNavigation hook to access navigation prop
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  const toggleRegisterModal = () => {
    setRegisterModalVisible(!registerModalVisible);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.44:5000/api/login', {
        email,
        password,
      });

      const { user } = response.data;

      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUserRole(user.role); // update the userRole state variable
        
      } catch (error) {
        console.error('Error storing data:', error);
      }
      // Redirect to the Home screen after successful login
      navigation.navigate('Accueil'); 

    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your credentials.');
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
        <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 10 }}>Log In</Button>
        <Button onPress={toggleRegisterModal} style={{ marginTop: 10 }}>
          Don't have an account? Sign up
        </Button>
      </View>
      {/* Render the Register component as a modal */}
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