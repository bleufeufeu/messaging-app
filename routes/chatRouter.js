const { Router } = require("express");
const router = Router();
const verifyToken = require("../middleware/authMiddleware.js");

const chatController = require("../controllers/chatController.js");
const messageController = require("../controllers/messageController.js");

router.post("/new", verifyToken, chatController.handleCreateChat);

router.get("/:chatId/messages", verifyToken, chatController.handleReturnMessagesByChat);

router.post("/:chatId/messages", verifyToken, messageController.handleCreateMessage);


module.exports = router;
