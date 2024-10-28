const express = require("express");
const router = express.Router();

const {
  createClap,
  getPostClaps,
  getUserClaps,
} = require("../controllers/claps");

router.route("/:id").post(createClap);
router.route("/:id").get(getPostClaps);
router.route("/users/:id").get(getUserClaps);

module.exports = router;
