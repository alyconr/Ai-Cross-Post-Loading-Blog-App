const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  updatePost,
} = require("../controllers/posts");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getSinglePost).delete(deletePost).put(updatePost);

module.exports = router;
