import React from 'react';
import { View, Pressable, Text, Linking, Platform } from 'react-native';

const SendMessage = () => {
  const phoneNumber = '0783674795'; // numero du patient
  const message = 'Bonjour, ceci est un SMS envoyé depuis mon application React Native !';

  const handleSendSMS = () => {
    const smsUrl = Platform.select({
      ios: `sms:${phoneNumber}&body=${encodeURIComponent(message)}`,
      android: `sms:${phoneNumber}?body=${encodeURIComponent(message)}`,
    });

    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (!supported) {
          console.log('Les SMS ne sont pas pris en charge sur cet appareil.');
        } else {
          return Linking.openURL(smsUrl);
        }
      })
      .catch(err => console.error('Erreur lors de l\'ouverture de l\'URL SMS:', err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable onPress={handleSendSMS} style={{ padding: 20, backgroundColor: 'blue', borderRadius: 10 }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Envoyer SMS</Text>
      </Pressable>
    </View>
  );
};

export default SendMessage;
