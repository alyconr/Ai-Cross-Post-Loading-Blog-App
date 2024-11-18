const express = require("express");
const router = express.Router();

const {
    createFollower,
    getTotalFollowers,
    getUserFollowers,
    unfollowUser
   
} = require("../controllers/followers");



router.route("/:id").post(createFollower);
router.route("/:id").get(getTotalFollowers);
router.route("/users/:id").get(getUserFollowers);
router.route("/unfollow/:id/:followingId").delete(unfollowUser);

module.exports = router