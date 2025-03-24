const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Simuler une base de données d'utilisateurs (en production, utilise une vraie base de données)
const users = [];

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });

  // Hacher le mot de passe
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Créer un nouvel utilisateur
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: "Utilisateur enregistré avec succès" });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Trouver l'utilisateur
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  // Générer un token JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};