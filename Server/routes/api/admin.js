const express = require('express')
const router = express.Router();

const Admin = require('../../Models/Admin');

router.get('/', (req, res) => {
    Admin.find()
        .then(admin => res.json(admin))
        .catch(err => res.status(404).json({noAdminFound: 'Pas d admin trouvées...'}));
});

router.get('/:id',  (req, res) => {
    Admin.findById(req.params.id)
        .then(admin => res.json(admin))
        .catch(err => res.status(404).json({noAdminFound: 'Pas d admin trouvées...'}));
});

router.post('/', (req,res) => {
    Admin.create(req.body)
        .then(admin => res.json(admin))
        .catch(err => res.status(400).json({error: 'Impossible d ajouter le patient'}))
});

router.put('/:id', (req, res) => {
    Admin.findByIdAndUpdate(req.params.id, req.body)
        .then(admin => res.json('Mise à jour effectuée !'))
        .catch(err => res.status(404).json({error: 'Impossible de mettre à jour'}));
});

router.delete('/:id', (req, res) => {
    Admin.findByIdAndRemove(req.params.id, req.body)
        .then(admin => res.json('Admin bien supprimé !'))
        .catch(err => res.status(404).json({error: 'Impossible de supprimer'}));
});



module.exports = router