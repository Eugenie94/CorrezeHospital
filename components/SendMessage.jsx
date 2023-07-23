import React, { useState } from 'react';
import { View, Pressable, Text, Linking, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function SendMessage({ mobile, message }) {
  const handleSendSMS = () => {
    const smsUrl = Platform.select({
      ios: `sms:${mobile}&body=${encodeURIComponent(message)}`,
      android: `sms:${mobile}?body=${encodeURIComponent(message)}`,
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
    <View>
      <Pressable onPress={handleSendSMS}>
      <IconButton icon="message-text" size={20} onPress={handleSendSMS} />
      </Pressable>
    </View>
  );
}