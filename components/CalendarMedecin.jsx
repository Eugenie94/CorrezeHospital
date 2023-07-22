import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';
import * as Calendar from 'expo-calendar';


export default function CalendarMedecin  ()  {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

    
    
    const handleAddEvent = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const calendars = await Calendar.getCalendarsAsync();
    
          if (calendars.length === 0) {
            Alert.alert('Aucun calendrier disponible');
            return;
          }
    
          const selectedCalendar = calendars[0];
    
          const event = {
            title: title,
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

          const eventId = await Calendar.createEventAsync(selectedCalendar.id, event);

          if (eventId) {
            alert(`Rendez-vous planifié avec ${title} le ${startDate}`);
          } else {
            Alert.alert("Erreur lors de la création de l'événement");
          }
        } else {
          Alert.alert('Permissions refusées');
        }
      };
    

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom du patient"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Date du rendez-vous (ex. 2023-07-20 10:00)"
        value={startDate}
        onChangeText={setStartDate}
      />
       <TextInput
                style={styles.input}
                placeholder="Date de fin (ex. 2023-07-20 11:00)"
                value={endDate}
                onChangeText={setEndDate}
            />
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
