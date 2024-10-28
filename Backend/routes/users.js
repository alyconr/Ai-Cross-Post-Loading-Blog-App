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
  updateMediumToken,
  updateHashnodeToken,
  updateOpenAiApiKey,
  getOpenAiApiKey,
  getMediumToken,
  getDevToken,
  getHashnodeToken,
  getApiKeys,
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
  .get(authorized, getDevToken)
  .put(authorized, updateDevToken);

router
  .route("/mediumToken/:userId")
  .get(authorized, getMediumToken)
  .put(authorized, updateMediumToken);

router
  .route("/hashnodeToken/:userId")
  .get(authorized, getHashnodeToken)
  .put(authorized, updateHashnodeToken);

router
  .route("/openAiApiKey/:userId")
  .get(authorized, getOpenAiApiKey)
  .put(authorized, updateOpenAiApiKey);

router.route("/apikeys/:userId").get(authorized, getApiKeys);
module.exports = router;
