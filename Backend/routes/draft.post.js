const express = require("express");
const router = express.Router();

const {
  getAllDraftPosts,
  createDraftPost,
  updateDraftPost,
  getSingleDraftPost,
  deleteDraftPost,
  deleteDraftPostById
} = require("../controllers/draft.post");

const { apiAuthorized} = require("../middleware/authorizedUser");

router
  .route("/")
  .get(getAllDraftPosts)
  .post(createDraftPost)
  .delete(deleteDraftPost);

router.route("/:id").delete(apiAuthorized, deleteDraftPostById);
router.route("/:id").put(updateDraftPost).get(getSingleDraftPost);

module.exports = router;
