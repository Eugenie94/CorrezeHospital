const express = require('express')
const router = express.Router();
router.use(express.json())

const Patient = require('../../Models/Patient');

router.get('/', (req, res) => {
    Patient.find()
        .then(patient => res.json(patient))
        .catch(err => res.status(404).json({noPatientFound: 'Pas de patient trouvé...'}));
});

router.get('/:id',  (req, res) => {
    Patient.findById(req.params.id)
        .then(patient => res.json(patient))
        .catch(err => res.status(404).json({noPatientFound: 'Pas de patient trouvé...'}));
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

//Treatements
router.post('/:id/add-treatment', (req, res) => {
    const { medicament, dosageParJour } = req.body;
    Patient.findById(req.params.id)
      .then((patient) => {
        patient.traitement.push({ medicament, dosageParJour });
        return patient.save();
      })
      .then((updatedPatient) => res.json(updatedPatient))
      .catch((err) => res.status(400).json({ error: 'Impossible d\'ajouter le traitement' }));
  });

  router.delete('/:id/remove-treatment/:treatmentId', (req, res) => {
    const patientId = req.params.id;
    const treatmentId = req.params.treatmentId;
  
    Patient.findById(patientId)
      .then((patient) => {
        if (!patient) {
          return res.status(404).json({ error: 'Patient non trouvé' });
        }
  
        // Filtrer l'élément du tableau en fonction de son ID
        patient.traitement = patient.traitement.filter(
          (treatment) => treatment._id.toString() !== treatmentId
        );
  
        // Sauvegarder le patient avec le traitement supprimé
        return patient.save();
      })
      .then((updatedPatient) => {
        // Répondre avec le patient mis à jour après la suppression du traitement
        res.json(updatedPatient);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({ error: 'Impossible de supprimer le traitement' });
      });
  });


module.exports = router