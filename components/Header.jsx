import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

export default function Header() {
    return (
        <Tab.Navigator
          screenOptions={{
            style: { backgroundColor: '#005EB8' }, // Couleur de fond de la barre de navigation
            activeTintColor: '#FFFFFF', // Couleur de l'icône actif (ex. blanc)
            inactiveTintColor: '#C0C0C0', // Couleur de l'icône inactif (ex. gris)
            showLabel: false, // Cacher les étiquettes de texte sous les icônes
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
            component={PatientsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="toolbox" size={30} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Médecins"
            component={DoctorsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="doctor" size={30} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Contact"
            component={ContactScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="email" size={30} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      );
    };