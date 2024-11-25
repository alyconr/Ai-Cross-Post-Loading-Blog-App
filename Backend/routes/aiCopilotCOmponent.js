const express = require("express");
const router = express.Router();

const { generateSuggestions } = require("../controllers/aiCopilotComponent");

router.route("/suggestions").post(generateSuggestions);

module.exports = router;

