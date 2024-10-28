const express = require("express");
const router = express.Router();

const {
  getAllDraftPosts,
  createDraftPost,
  updateDraftPost,
  getSingleDraftPost,
  deleteDraftPost,
} = require("../controllers/draft.post");

router
  .route("/")
  .get(getAllDraftPosts)
  .post(createDraftPost)
  .delete(deleteDraftPost);
router.route("/:id").put(updateDraftPost).get(getSingleDraftPost);

module.exports = router;
