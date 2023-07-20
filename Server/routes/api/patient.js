const express = require('express')
const router = express.Router();

const Patient = require('../../Models/Patient');

router.get('/test', (req, res) => res.send('book route testing !'));

router.get('/', (req, res) => {
    Patient.find()
        .then(patient => res.json(patient))
        .catch(err => res.status(404).json({noPatientFound: 'Pas de patients trouvées...'}));
});

router.get('/:id',  (req, res) => {
    Patient.findById(req.params.id)
        .then(patient => res.json(patient))
        .catch(err => res.status(404).json({noPatientFound: 'Pas de patients trouvées...'}));
});

router.post('/', (req,res) => {
    Patient.create(req.body)
        .then(patient => res.json(patient))
        .catch(err => res.status(400).json({error: 'Impossible d ajouter le patient'}))
});

router.put('/:id', (req, res) => {
    Patient.findByIdAndUpdate(req.params.id, req.body)
        .then(patient => res.json('Mise à jour effectuée !'))
        .catch(err => res.status(404).json({error: 'Impossible de mettre à jour'}));
});

router.delete('/:id', (req, res) => {
    Patient.findByIdAndRemove(req.params.id, req.body)
        .then(patient => res.json('Patient bien supprimé !'))
        .catch(err => res.status(404).json({error: 'Impossible de supprimer'}));
});



module.exports = router