const express = require("express");
const router = express.Router();

const { authPostLinkedin } = require("../controllers/authLinkedinPost");

router.route("/").get(authPostLinkedin);

module.exports = router