const express = require("express");
const router = express.Router();

const { createBookmark, getAllBookmarks, deleteBookmark } = require("../controllers/bookmarks");

router.route("/").post(createBookmark)
router.route("/:id").delete(deleteBookmark).get(getAllBookmarks);

module.exports = router;
