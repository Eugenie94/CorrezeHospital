const express = require('express')
const router = express.Router();
const User = require('../../Models/User')
const bcrypt = require('bcrypt');
router.use(express.json())

router.get('/', (req, res) => {
    User.find()
        .then(User => res.json(User))
        .catch(err => res.status(404).json({noUserFound: "Pas d'users"}));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Identifiants de connexion invalides' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Identifiants de connexion invalides' });
      return;
    }
  
      const { _id, role } = user; // Add the 'role' field to be returned in the response
  
      res.json({
        user: { _id, role }, // Include 'role' in the response
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  });

  // Route d'inscription
router.post('/register', async (req, res) => {
    const {email, password, role } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Cet email est déjà utilisé' });
        return;
      }

    const allowedRoles = ['admin', 'medecin', 'rh'];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ error: 'Le rôle doit être l\'un des suivants: admin, medecin, rh' });
      return;
    }
  
      const newUser = new User({
        email,
        password,
        role
      });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser.password = hashedPassword;
  
      const savedUser = await newUser.save();
  
      res.json(savedUser);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  });
  



module.exports = router