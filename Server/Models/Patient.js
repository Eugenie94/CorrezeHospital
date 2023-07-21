const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  poids: {
    type: Number,
    required: true,
  },
  taille: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  traitement: [
    {
      medicament: {
        type: String,
        required: true,
      },
      dosageParJour: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = Patient = mongoose.model('patients', patientSchema, "patients");
