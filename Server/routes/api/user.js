const express = require('express')
const router = express.Router();
const User = require('../../Models/User')
const Rh = require('../../Models/Rh')
const Admin = require('../../Models/Admin')
const Medecin = require('../../Models/Medecin')
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
    const { email, password, role } = req.body;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    try {
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Veuillez saisir un email valide' });
        return;
      }


  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'Cet email est déjà utilisé' });
        return;
      }

    let checkUser;
    if (role === 'admin') {
      checkUser = await Admin.findOne({ email });
    } 
    if (role === 'medecin') {
      checkUser = await Medecin.findOne({ email });
    }
    if (role === 'rh') {
      checkUser = await Rh.findOne({ email });
    }
    if (!checkUser) {
      res.status(400).json({ error: 'Email introuvable' });
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
        role,
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