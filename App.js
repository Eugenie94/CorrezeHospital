import React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; // Import the NavigationContainer
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './components/Header';

// ... Your other component imports and screens ...

const Tab = createBottomTabNavigator();

// ... Your other screen components ...

export default function App() {
  return (
    <NavigationContainer>
      <Header />
    </NavigationContainer>
  );
}
