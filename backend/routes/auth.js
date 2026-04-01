const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET_KEY = "secret123";

const users = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    role: "admin",
    team: "Team A",
  },
  {
    id: 2,
    username: "user",
    password: "111111",
    role: "user",
    team: "Team A",
  },
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Невірний логін або пароль" });
  }

  const token = jwt.sign(
    {
      id: user.id,
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
      id: user.id,
      username: user.username,
      role: user.role,
      team: user.team,
    },
  });
});

module.exports = router;
