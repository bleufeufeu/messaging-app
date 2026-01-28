const { Router } = require("express");
const router = Router();
const verifyToken = require("../middleware/authMiddleware.js");

const messageController = require("../controllers/messageController.js");

router.put("/:messageId/edit", verifyToken, messageController.handleEditMessage);
router.delete("/:messageId/delete", verifyToken, messageController.handleDeleteMessage);

module.exports = router;