require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./db/conn'); // Assurez-vous que le chemin vers le fichier conn.js est correct

const Patient = require('./routes/api/patient')
const Admin = require('./routes/api/admin')
const Medecin = require('./routes/api/medecin')
const Rh = require('./routes/api/rh')




const app = express();



connectDb(); // Appel de la fonction connectDb pour établir la connexion à MongoDB

app.use('/api/patient', Patient)
app.use('/api/admin', Admin)
app.use('/api/medecin', Medecin)
app.use('/api/rh', Rh)



app.listen(5000, () => {
    console.log("http://localhost:5000");
});
