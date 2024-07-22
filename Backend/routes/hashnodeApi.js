const express = require("express");
const router = express.Router();

const { postHashnodeApi, getHashnodePosts } = require("../controllers/hashnodeApi");

router.route("/").post(postHashnodeApi);
router.route("/:userId").get(getHashnodePosts);

module.exports = router;
