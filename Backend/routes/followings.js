const express = require("express");
const router = express.Router();

const { getFollowings } = require("../controllers/followings");

router.route("/:id").get(getFollowings);


module.exports = router;
