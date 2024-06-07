require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) { 
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.post("/api/v1/upload", upload.single("file"), (req, res) => {
 
    const file = req.file;

    if (!file) {
      // If no file is provided, respond with an error
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = file.filename;

    return res.status(200).json(filename);
 
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
