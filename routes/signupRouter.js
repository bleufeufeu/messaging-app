const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const db = require("../db/queries");

const signupController = require("../controllers/signupController.js");

router.post(
  "/",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long.")
      .custom(async (value) => {
        const user = await db.returnUserByUsername(value);
        if (user && user.length > 0) {
          throw new Error("Username already in use");
        }
      }),
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
  signupController.handleSignUp,
);

module.exports = router;