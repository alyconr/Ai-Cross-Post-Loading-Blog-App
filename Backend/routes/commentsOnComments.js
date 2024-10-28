const express = require("express");

const router = express.Router();

const {
  createCommentsOnComment,
  getCommentsOnComments,
  deleteCommentsOnComment,
  updateCommentOnComment,
} = require("../controllers/commentsOnComment");

router.route("/:id").post(createCommentsOnComment).get(getCommentsOnComments);
router
  .route("/:id")
  .delete(deleteCommentsOnComment)
  .put(updateCommentOnComment);

module.exports = router;
