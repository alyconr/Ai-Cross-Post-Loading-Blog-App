const express = require("express");
const router = express.Router();

const { postMediumApi } = require("../controllers/mediumApi");

router.route("/").post(postMediumApi);

module.exports = router;
