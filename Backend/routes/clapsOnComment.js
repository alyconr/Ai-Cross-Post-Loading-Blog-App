const express = require("express");
const router = express.Router();

const {
  createClapOnComment,
  getUsersClapsOnComment,
  getTotalClapsOnComment,
} = require("../controllers/clapsOnComment");

router.route("/:id").post(createClapOnComment);
router.route("/:id").get(getTotalClapsOnComment);
router.route("/users/:id").get(getUsersClapsOnComment);

module.exports = router;
