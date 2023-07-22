// import React, { useEffect, useState } from 'react';
// import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
// import { List, Divider } from 'react-native-paper';
// import CustomCard from './CustomCard';
// import Axios from 'axios';

// export default function CustomList() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState(false); // Mettez à jour la valeur isAdmin en fonction de l'état de connexion

//   useEffect(() => {
//     // Fetch data based on the type ('patient' or 'doctor')
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         if (userRole === 'patient') {
//           const response = await Axios.get('http://10.74.3.67:5000/api/patient');
//           setData(response.data);
//         } else if (userRole === 'doctor') {
//           const response = await Axios.get('http://10.74.3.67:5000/api/medecin');
//           setData(response.data);
//         } else if (userRole === 'rh') {
//           const response = await Axios.get('http://10.74.3.67:5000/api/rh');
//           setData(response.data);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error while fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [type]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="blue" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <List.Section>
//         {data.map((patient) => (
//           <View key={patient._id}>
//             <CustomCard
//               role={userRole} // Assurez-vous de passer le rôle de l'utilisateur à CustomCard
//               name={`${patient.nom} ${patient.prenom}`}
//               age={patient.age}
//               poids={patient.poids}
//               taille={patient.taille}
//               email={patient.email}
//               mobile={patient.mobile}
//               treatment={patient.traitement}
//               onEdit={() => handleEditPatient(patient._id, { /* les données mises à jour du patient */ })}
//               onDelete={() => handleDeletePatient(patient._id)}
//             />
//             <Divider />
//           </View>
//         ))}
//       </List.Section>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
// });