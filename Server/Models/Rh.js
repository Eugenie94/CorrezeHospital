const mongoose = require('mongoose');

const rhSchema = new mongoose.Schema({
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
},{versionKey : false});

const RH = mongoose.model('Rh', rhSchema, 'Rh');

module.exports = RH;
