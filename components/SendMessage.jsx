import React, { useState } from 'react';
import { View, Pressable, Text, Linking, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function SendMessage({ mobile, message }) {
  // Fonction qui gère l'envoi du SMS
  const handleSendSMS = () => {
    // Construire l'URL SMS appropriée en fonction de la plate-forme (iOS ou Android)
    const smsUrl = Platform.select({
      ios: `sms:${mobile}&body=${encodeURIComponent(message)}`,
      android: `sms:${mobile}?body=${encodeURIComponent(message)}`,
    });

    // Vérifier si l'ouverture de l'URL est prise en charge sur l'appareil
    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (!supported) {
          console.log('Les SMS ne sont pas pris en charge sur cet appareil.');
        } else {
          // Ouvrir l'application de messagerie SMS avec l'URL construite
          return Linking.openURL(smsUrl);
        }
      })
      .catch(err => console.error('Erreur lors de l\'ouverture de l\'URL SMS:', err));
  };

  return (
    <View>
      {/* Utilisation d'un composant Pressable pour déclencher la fonction handleSendSMS */}
      <Pressable onPress={handleSendSMS}>
        {/* Utilisation d'un IconButton avec l'icône "message-text" pour afficher le bouton d'envoi du SMS */}
        <IconButton icon="message-text" size={20} onPress={handleSendSMS} />
      </Pressable>
    </View>
  );
}
