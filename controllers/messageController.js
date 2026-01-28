const db = require("../db/queries");

async function handleCreateMessage(req, res) {
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
        if (!req.body.content) {
            return res.status(422).json("Message is empty");
        }

        const newMessage = await db.createMessage(req.body.content, req.user.id, chat.id);
        
        return res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function handleEditMessage(req, res) {
    const { messageId } = req.params;
    const message = await db.returnMessageById(messageId);

    if (!message) {
        return res.status(404).json({ error: "Message not found"});
    }

    if (message.userId !== req.user.id) {
        return res.status(404).json({ error: "Forbidden"});
    }

    try {
        if (!req.body.content) {
            return res.status(422).json("Message is empty");
        }

        const editedMessage = await db.updateEditMessage(message.id, req.body.content);

        return res.status(200).json(editedMessage);
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

async function handleDeleteMessage(req, res) {
    const { messageId } = req.params;
    const message = await db.returnMessageById(messageId);

    if (!message) {
        return res.status(404).json({ error: "Message not found"});
    }

    if (message.userId !== req.user.id) {
        return res.status(404).json({ error: "Forbidden"});
    }

    try {
        const deletedMessage = await db.deleteMessage(message.id);

        return res.status(200).json(deletedMessage);
        
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


module.exports = {
  handleCreateMessage,
  handleEditMessage,
  handleDeleteMessage
};
