const express = require("express");
const router = express.Router();

const { register, login, logout, requestPasswordReset, resetPassword } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/requestPasswordReset", requestPasswordReset);
router.post("/resetPassword", resetPassword);

module.exports = router;
