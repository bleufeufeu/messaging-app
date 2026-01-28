const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const verifyToken = require("../middleware/authMiddleware.js");

const usersController = require("../controllers/usersController.js");

router.get("/me", verifyToken, usersController.handleReturnMyUserDetails);
router.get("/all", verifyToken, usersController.handleReturnAllUsersExceptSelf);
router.get("/chats", verifyToken, usersController.handleReturnAllChats);
router.put("/newpassword", verifyToken, [
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  usersController.handleUpdatePassword)

module.exports = router;
