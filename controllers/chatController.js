const db = require("../db/queries");

async function handleCreateChat(req, res) {
  try {
    if (!req.body.users) {
        return res.status(422).json("Empty chat (no users)");
    }

    const newChat = await db.createChat(req.body.users);
    
    return res.status(201).json(newChat)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

async function handleReturnMessagesByChat(req, res) {
    const { chatId } = req.params;
    const chat = await db.returnChatById(chatId);

    if (!chat) {
        return res.status(404).json({ error: "Chat does not exist"});
    }

    const userCheck = await db.checkIfUserInChat(req.user.id, chat.id);

    if (!userCheck) {
        return res.status(404).json({ error: "You are not in this chat"});
    }
    
    try {
        const messages = await db.returnAllMessagesByChat(chat.id);
        
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
  handleCreateChat,
  handleReturnMessagesByChat
};
