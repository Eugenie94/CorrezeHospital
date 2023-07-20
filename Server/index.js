require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Patient = require('./routes/api/patient')

const app = express();


const connectDb = require('./db/conn')



const model_patient = require('./Models/Patient');

app.use(cors());
app.use(express.json());

connectDb();


app.use('/api/patient', Patient)


app.listen(5000, () => {
    console.log("http://localhost:5000");
})