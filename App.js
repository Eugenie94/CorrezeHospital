import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
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
  <View style={styles.container}>
    <Image
      source={require('./assets/19-ch-coeur-de-correze.png')}
      style={styles.logo}
    />
  </View>
);


export default function App() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRoleData = JSON.parse(await AsyncStorage.getItem('user'));
        setUserRole(userRoleData.role)
      } catch (error) {    
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
              children={() => <Patients userRole={userRole} />}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Médecins"
              children={() => <Doctor userRole={userRole} />}
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
              name="Deconnexion"
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
              children={() => <Patients userRole={userRole} />}
              options={({ color }) => ({
                tabBarIcon: ({ color }) => (
                  <Icon name="toolbox" size={30} color={color} />
                ),
              })}
            />
            <Tab.Screen
              name="Deconnexion"
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF', // Change the background color if needed
    },
    logo: {
      width: 400,
      height: 400,
      resizeMode: 'contain', // Adjust the image's size and aspect ratio
    },
  });
