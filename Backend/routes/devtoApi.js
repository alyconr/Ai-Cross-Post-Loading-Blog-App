const express = require("express");
const router = express.Router();

const { postDevtoApi, getPostsDevto } = require("../controllers/devtoApi");

router.route("/").post(postDevtoApi);
router.route("/:userId").get(getPostsDevto);

module.exports = router;
