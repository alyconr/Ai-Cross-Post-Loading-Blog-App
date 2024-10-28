const express = require("express");
const router = express.Router();
const { generateBlogPost } = require("../controllers/aiBlogPostController");

router.post("/generate", generateBlogPost);

module.exports = router;