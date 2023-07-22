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
import Profile from './components/Profile';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran d'accueil */}
  </View>
);


export default function App() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRoleData = JSON.parse(await AsyncStorage.getItem('user'));
        const login = JSON.parse(await AsyncStorage.getItem('isLoggedIn'));
        setUserRole(userRoleData.role)
        console.log('User role:', userRoleData.role);
        console.log('User login:', login); 
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);


  useEffect(() => {
  }, [userRole]);

  return (
    <>
    {(userRole === 'admin') ? (
      <NavigationContainer >
        <Tab.Navigator
          screenOptions={{
            style: { backgroundColor: '#005EB8' },
            activeTintColor: '#FFFFFF',
            inactiveTintColor: '#C0C0C0',
            showLabel: false,
          }}
        >
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
              name="Profil"
              children={() => <Profile setUserRole={setUserRole} />}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="account" size={30} color={color} />
                ),
              })}
            />
        </Tab.Navigator>
      </NavigationContainer> ) : ( 
        (userRole === 'rh' || userRole === 'medecin') ?
        (
        <NavigationContainer>
          <Tab.Navigator>
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
              name="Profil"
              children={() => <Profile setUserRole={setUserRole} />}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="account" size={30} color={color} />
                ),
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
        ):
        (
          <NavigationContainer>
          <Tab.Navigator>
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
              name="Login"
              children={() => <Login setUserRole={setUserRole} />}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="account" size={30} color={color} />
                ),
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>
        )
    )}
    </>

    
  )}
