const express = require("express");
const router = express.Router();

const {
  createComment,
  getComments,
  deleteComment,
  updateComment,
} = require("../controllers/comments");

router.route("/:id").post(createComment).get(getComments);
router.route("/postId/:id").delete(deleteComment).put(updateComment);

module.exports = router;
