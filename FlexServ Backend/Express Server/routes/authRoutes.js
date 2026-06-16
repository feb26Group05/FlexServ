
const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
// here we need to have register function
  login,
  getCurrentUser
} = require("../controllers/authController");

router.get(
    "/me",
    authenticate,
    getCurrentUser
);

// here we need to have 
// router.post("/register", register);

router.post("/login", login);

module.exports = router;