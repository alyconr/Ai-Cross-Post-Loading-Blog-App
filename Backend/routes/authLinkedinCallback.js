const express = require("express");
const router = express.Router();

const { authLinkedinCallback } = require("../controllers/authLinkedinCallback");

router.route("/").get(authLinkedinCallback);

module.exports = router;
