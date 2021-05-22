const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
// import du model User

router.post("/user/sign_up", async (req, res) => {
  try {
    const { email, password, username, name, description } = req.fields;

    const userEmail = await User.findOne({ email: email });
    const userName = await User.findOne({ "account.username": username });

    if (userEmail) {
      res.status(400).json({ error: "This email already has an account." });
    } else {
      if (userName) {
        res
          .status(400)
          .json({ error: "This username already has an account." });
      } else {
        if (email && password && username && name && description) {
          const salt = uid2(16);
          const hash = SHA256(salt + password).toString(encBase64);
          const token = uid2(64);

          const newUser = new User({
            email: email,
            token: token,
            hash: hash,
            salt: salt,
            account: {
              username: username,
              name: name,
              description: description,
            },
          });

          await newUser.save();

          res.status(200).json({
            _id: newUser._id,
            token: newUser.token,
            email: newUser.email,
            description: newUser.account.description,
            name: newUser.account.name,
          });
        } else {
          res.status(400).json({ error: "Missing parameters." });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;
    //
    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const newHash = SHA256(user.salt + password).toString(encBase64);

        if (user.hash === newHash) {
          res.status(200).json({
            _id: user._id,
            token: user.token,
            email: user.email,
            username: user.account.username,
            description: user.account.description,
            name: user.account.name,
          });
        } else {
          res.status(400).json({ error: "Password erroné" });
        }
      } else {
        res.status(400).json({ error: "Unauthorized" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Veuillez saisir un email et un mot de passe" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
