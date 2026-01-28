const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function handleReturnMyUserDetails(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const userDetails = await db.returnUserById(req.user.id);
    
    return res.status(200).json({ id: userDetails.id, username: userDetails.username })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function handleReturnAllUsersExceptSelf(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const allUsers = await db.returnAllUsersExceptSelf(req.user.id);
    
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function handleReturnAllChats(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const chats = await db.returnAllChatsByUser(req.user.id);
    
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function handleUpdatePassword(req, res) {
  if (!req.user) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const errors = validationResult(req);
  
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.updatePassword(
      req.user.id,
      hashedPassword,
    );
    return res.status(201).json({
        message: "Password updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  handleReturnMyUserDetails,
  handleReturnAllUsersExceptSelf,
  handleReturnAllChats,
  handleUpdatePassword
};
