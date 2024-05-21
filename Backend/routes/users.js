const express = require("express");
const router = express.Router();

const { authorizedUser, authorized } = require("../middleware/authorizedUser");

const {
  getCurrentUser,
  updateUser,
  getUserPosts,
  getAllUsers,
  deleteUser,
  updateDevToken,
  getDevToken,
} = require("../controllers/users");

router
  .route("/:username")
  .get(getCurrentUser)
  .put(authorizedUser, updateUser)
  .delete(deleteUser);
router.route("/posts/:username").get(getUserPosts);
router.route("/").get(getAllUsers);

router
  .route("/devToken/:userId")
  .get(getDevToken)
  .put(authorized, updateDevToken);

module.exports = router;
