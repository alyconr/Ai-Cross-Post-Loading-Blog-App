const express = require("express");
const router = express.Router();

const { postDevtoApi } = require("../controllers/devtoApi");

router.route("/").post(postDevtoApi);

module.exports = router;
