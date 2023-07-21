import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Patients from './components/Patients';
import Doctor from './components/Doctors';
import Rh from './components/Rh';
import Login from './components/Login';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran d'accueil */}
  </View>
);

const LoginScreen = () => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => (!'isLoggedIn')}>
       <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRole = await AsyncStorage.getItem('userRole'); // Replace 'userRole' with the correct key used to store the user role in AsyncStorage
        setUserRole(userRole);
        console.log('User role:', userRole); // Console log user role
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          style: { backgroundColor: '#005EB8' },
          activeTintColor: '#FFFFFF',
          inactiveTintColor: '#C0C0C0',
          showLabel: false,
        }}
      >
        {userRole === 'admin' ? (
          <>
            <Tab.Screen
              name="Accueil"
              component={HomeScreen}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Patient"
              component={Patients}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Médecins"
              component={Doctor}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="doctor" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Rh"
              component={Rh}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="briefcase" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="account" size={30} color={color} />
                ),
              })}
            />
          </>
        ) : (
          // If user role is not "admin" so "rh" or "medecin"
          <>
            <Tab.Screen
              name="Accueil"
              component={HomeScreen}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Patient"
              component={Patients}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="account" size={30} color={color} />
                ),
              })}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}