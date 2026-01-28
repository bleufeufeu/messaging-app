const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleLogin(req, res) {

  try {
    const { username, password } = req.body;

    const user = await db.returnUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRETKEY, { expiresIn: "24h"});

    return res.status(200).json({ token, user: { id: user.id, username: user.username } });

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  handleLogin,
};
