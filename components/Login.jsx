import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';

const Login = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to access navigation prop
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://10.74.3.71:5000/api/login', {
        email,
        password,
      });

      const { user } = response.data;
      console.log(user);

      try {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error storing data:', error);
      }

      // Redirect to the Home screen after successful login
      navigation.navigate('Accueil'); // Assuming the name of the Home screen is "Accueil"

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
        <Button onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }}>Don't have an account? Sign up</Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;