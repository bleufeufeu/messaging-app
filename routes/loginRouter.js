const { Router } = require("express");
const router = Router();

const loginController = require("../controllers/loginController.js");

router.post("/", loginController.handleLogin);

module.exports = router;
