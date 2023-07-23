import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import * as Calendar from 'expo-calendar';
import SendMessage from './SendMessage';

export default function CalendarMedecin({ visible, medecinConnecteName, patientMobile, medecinName }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSendSMS = () => {
    // Vérifiez si le message est défini avant d'envoyer le SMS
    if (medecinConnecteName && startDate) {
      const message = `Vous avez un rendez-vous planifié avec ${medecinConnecteName} le ${startDate}.`;
      SendMessage({ mobile: patientMobile, message: message });
    } else {
      console.error('Impossible d\'envoyer le SMS car le nom du médecin ou la date du rendez-vous est manquant.');
    }
  };

  const handleAddEvent = async () => {
    // Vérifier si les champs sont remplis
    if (!startDate || !endDate) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Demander la permission d'accès au calendrier
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissions refusées');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync();
      if (calendars.length === 0) {
        alert('Aucun calendrier disponible');
        return;
      }

      const selectedCalendar = calendars[0];

      // Définir les détails de l'événement à ajouter au calendrier
      const event = {
        title: `Rendez-vous programmé avec ${medecinName}`,
        color: 'blue',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timeZone: 'GMT',
        location: '',
        alarms: [
          {
            relativeOffset: -30,
            method: Calendar.AlarmMethod.ALERT,
          },
        ],
      };

      // Créer l'événement dans le calendrier
      const eventId = await Calendar.createEventAsync(selectedCalendar.id, event);

      if (eventId) {
        // Envoyer un SMS pour confirmer le rendez-vous
        handleSendSMS();
        alert(`Rendez-vous planifié avec ${medecinConnecteName} le ${startDate}`);
      } else {
        alert("Erreur lors de la création de l'événement");
      }
    } catch (error) {
      // Gérer l'erreur ici en cas d'échec de la planification de l'événement
      console.error('Erreur lors de la planification de l\'événement :', error);
      alert('Une erreur est survenue lors de la planification de l\'événement.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Champ de saisie pour la date du rendez-vous */}
      <TextInput
        style={styles.input}
        placeholder="Date du rendez-vous (ex. 2023-07-20 10:00)"
        value={startDate}
        onChangeText={setStartDate}
      />
      {/* Champ de saisie pour la date de fin du rendez-vous */}
      <TextInput
        style={styles.input}
        placeholder="Date de fin (ex. 2023-07-20 11:00)"
        value={endDate}
        onChangeText={setEndDate}
      />
      {/* Bouton pour planifier le rendez-vous */}
      <Button title="Planifier un rendez-vous" onPress={handleAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingLeft: 10,
  },
});
