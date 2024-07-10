const express = require("express");
const router = express.Router();

const { postLinkedin } = require("../controllers/linkedinPost");

router.route("/").get(postLinkedin);

module.exports = router;