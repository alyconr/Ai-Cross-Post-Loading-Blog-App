const express = require("express");
const router = express.Router();

const { postHashnodeApi } = require("../controllers/hashnodeApi");

router.route("/").post(postHashnodeApi);

module.exports = router;

