const User = require("../models/User");

// la fonction isAuthenticated est un middleware

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      // si l'on reçoit un token
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""), // le token reçu est précédé de "Bearer "
      });
      // on cherche si le token reçu est présent en BDD
      // si le token existe en BDD, la variable user contiendra les informations du user associé au token
      // si le token n'existe pas en BDD, la varianle user sera null

      if (!user) {
        // si la variable user est null
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        // si la variable user a bien été créée
        req.user = user;
        // on ajoute une clé "user" à l'objet req
        // cette clé contient les informations de l'utilisateur associé au token
        return next();
        // la fonction next() permet de passer à la suite du code (celui de la route où a été appelée la fonction isAuthenticated)
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    // si aucun token n'a été reçu
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
