const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = "secret123";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Невірний логін або пароль" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
      },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Помилка входу" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const user = new User({
      username,
      password,
      role: "user",
      team: "Team A",
    });

    await user.save();

    res.status(201).json({
      message: "Користувача створено",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Помилка реєстрації" });
  }
});

module.exports = router;
