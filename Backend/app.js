require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json({ limit: "50" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    // If no file is provided, respond with an error
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = Date.now() + path.extname(file.originalname);
  const filepath = path.join(__dirname, "uploads", filename);

  try {
    // Compress and resize image
    await sharp(file.buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath);

    return res.status(200).json(filename);
  } catch (error) {
    console.error("Error processing image:", error);
    return res.status(500).json({ error: "Error processing image" });
  }
});

const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const clapsRouter = require("./routes/claps");
const commentsRouter = require("./routes/comments");
const clapsOnCommentsRouter = require("./routes/clapsOnComment");
const clapsCommentsOnCommentsRouter = require("./routes/clapsCommentsOnComments");
const comentsOnCommentRouter = require("./routes/commentsOnComments");
const draftPostsRouter = require("./routes/draft.post");
const followersRouter = require("./routes/followers");
const followingsRouter = require("./routes/followings");
const bookmarksRouter = require("./routes/bookmarks");
const devToApi = require("./routes/devtoApi");
const mediumApi = require("./routes/mediumApi");
const hashnodeApi = require("./routes/hashnodeApi");
const linkedinPost = require("./routes/linkedinPost");
const authLinkedinPost = require("./routes/authLinkedinPost");
const authLinkedinCallback = require("./routes/authLinkedinCallback");
const aiBlogPostGenerator = require("./routes/aiBlogPostRoutes");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/draftposts", draftPostsRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/claps", clapsRouter);
app.use("/api/v1/clapsoncomments", clapsOnCommentsRouter);
app.use("/api/v1/clapsoncommentsoncomment", clapsCommentsOnCommentsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/commentsoncomment", comentsOnCommentRouter);
app.use("/api/v1/followers", followersRouter);
app.use("/api/v1/followings", followingsRouter);
app.use("/api/v1/bookmarks", bookmarksRouter);
app.use("/api/v1/devto-proxy", devToApi);
app.use("/api/v1/medium-proxy", mediumApi);
app.use("/api/v1/hashnode-proxy", hashnodeApi);
app.use("/api/v1/linkedin-proxy", linkedinPost);
app.use("/auth/linkedin", authLinkedinPost);
app.use("/auth/linkedin/callback", authLinkedinCallback);
app.use("/api/v1/generateBlogPost", aiBlogPostGenerator);

app.get("/", (req, res) => {
  res.send("Hello World, IT WORKS");
});

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(
        `Server is listening on port ${port} and Database is connected`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
