const express = require('express')
const router = express.Router();
router.use(express.json())

const Medecin = require('../../Models/Medecin');

router.get('/', (req, res) => {
    Medecin.find()
        .then(medecin => res.json(medecin))
        .catch(err => res.status(404).json({noMedecinFound: 'Pas de medecin trouvées...'}));
});

router.get('/:id',  (req, res) => {
    Medecin.findById(req.params.id)
        .then(medecin => res.json(medecin))
        .catch(err => res.status(404).json({noMedecinFound: 'Pas de medecin trouvées...'}));
});

router.post('/', (req,res) => {
    Medecin.create(req.body)
        .then(medecin => res.json(medecin))
        .catch(err => res.status(400).json({error: 'Impossible d ajouter le medecin'}))
});

router.put('/:id', (req, res) => {
    Medecin.findByIdAndUpdate(req.params.id, req.body)
        .then(medecin => res.json('Mise à jour effectuée !'))
        .catch(err => res.status(404).json({error: 'Impossible de mettre à jour'}));
});

router.delete('/:id', (req, res) => {
    Medecin.findByIdAndRemove(req.params.id, req.body)
        .then(medecin => res.json('Medecin bien supprimé !'))
        .catch(err => res.status(404).json({error: 'Impossible de supprimer'}));
});


module.exports = router