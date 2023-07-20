const express = require('express')
const router = express.Router();

const RH = require('../../Models/Rh');

router.get('/', (req, res) => {
    RH.find()
        .then(rh => res.json(rh))
        .catch(err => res.status(404).json({noRhFound: 'Pas de rh trouvées...'}));
});

router.get('/:id',  (req, res) => {
    RH.findById(req.params.id)
        .then(rh => res.json(rh))
        .catch(err => res.status(404).json({noRhFound: 'Pas de rh trouvées...'}));
});

router.post('/', (req,res) => {
    RH.create(req.body)
        .then(rh => res.json(rh))
        .catch(err => res.status(400).json({error: 'Impossible d ajouter le rh'}))
});

router.put('/:id', (req, res) => {
    RH.findByIdAndUpdate(req.params.id, req.body)
        .then(rh => res.json('Mise à jour effectuée !'))
        .catch(err => res.status(404).json({error: 'Impossible de mettre à jour'}));
});

router.delete('/:id', (req, res) => {
    RH.findByIdAndRemove(req.params.id, req.body)
        .then(rh => res.json('RH bien supprimé !'))
        .catch(err => res.status(404).json({error: 'Impossible de supprimer'}));
});



module.exports = router