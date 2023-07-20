import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Patients from './Patients';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran d'accueil */}
  </View>
);

const PatientsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran des patients */}
  </View>
);

const DoctorsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran des médecins */}
  </View>
);

const ContactScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {/* Contenu de l'écran de contact */}
  </View>
);

const LoginScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => setIsLoggedIn(!isLoggedIn)}>
        <Icon
          name={isLoggedIn ? 'account' : 'power'}
          size={30}
          color={isLoggedIn ? 'green' : 'red'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
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
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={30} color={color} />
          ),
        }}
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
        component={DoctorsScreen}
        options={({ color }) => ({
          tabBarIcon: ({ color }) => (
            <Icon name="doctor" size={30} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={({ color }) => ({
          tabBarIcon: ({ color }) => (
            <Icon name="email" size={30} color={color} />
          ),
        })}
      />
      {/* Ajoutez une condition pour afficher l'icône de connexion/profil */}
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={({ color }) => ({
          tabBarIcon: ({ color }) => (
            <Icon
              name={isLoggedIn ? 'account' : 'power'}
              size={30}
              color={isLoggedIn ? 'grey' : 'blue'}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};
