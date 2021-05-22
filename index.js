const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
// initialisation du serveur

app.use(helmet());
// activation des protections

app.use(formidable());
// activation de récupération paraètres fields avec méthode HTTP POST

app.use(cors());
// autorisation de requêtes provenant de nom de domaine différent du serveur

mongoose.connect("mongodb://localhost/airbnb-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// connexion à la base de données locale "airbnb-api"

const useRoutes = require("./routes/user");
// import des routes

app.use(useRoutes);
// activation de l'utilisation des routes

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});
// affichage d'une erreur 404 pour toutes les routes non trouvées

app.listen(3000, () => {
  console.log("Server has started");
});
// démarage du serveur
