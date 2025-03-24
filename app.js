require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const { authenticate } = require("./middleware/authMiddleware");

const app = express();
const port = 4000;

// Middleware JSON
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur de connexion", err));

// Routes
app.use("/auth", authRoutes);

// Les routes GET sont non protégées
app.get("/books", bookRoutes); // Liste des livres
app.get("/books/:id", bookRoutes); // Détails d'un livre
app.get("/authors", authorRoutes); // Liste des auteurs
app.get("/authors/:id", authorRoutes); // Détails d'un auteur

// Les autres routes sont protégées par JWT
app.use("/books", authenticate, bookRoutes);
app.use("/authors", authenticate, authorRoutes);

// Route principale
app.get("/", (req, res) => {
  res.send({ message: "Bienvenue à la bibliothèque Tanguy!" });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});