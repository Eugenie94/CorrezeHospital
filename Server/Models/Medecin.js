const mongoose = require('mongoose');

const medecinSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Medecin = mongoose.model('medecin', medecinSchema, 'medecin');

module.exports = Medecin;
