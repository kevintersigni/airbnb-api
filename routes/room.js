const express = require("express");

const router = express.Router();

const Room = require("../models/Room");
const User = require("../models/User");
// import du model Room

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/room/publish", isAuthenticated, async (req, res) => {
  const { title, description, price, location } = req.fields;
  if (title && description && price && location) {
    try {
      const newRoom = new Room({
        title: title,
        description: description,
        price: price,
        location: [location.lat, location.lng],
        user: req.user._id,
      });

      await newRoom.save();

      const updateUser = await User.findById(req.user._id);
      updateUser.rooms.push(newRoom._id);

      await updateUser.save();
      res.status(200).json(newRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Missing parameters" });
  }
});

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({}, { description: false });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
