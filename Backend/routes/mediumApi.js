const express = require("express");
const router = express.Router();

const { postMediumApi, getMediumPosts } = require("../controllers/mediumApi");

router.route("/").post(postMediumApi);
router.route("/:userId").get(getMediumPosts);

module.exports = router;
