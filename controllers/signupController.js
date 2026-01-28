const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function handleSignUp(req, res) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(
      req.body.username,
      hashedPassword,
    );
    return res.status(201).json({
        message: "User created successfully"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  handleSignUp,
};
