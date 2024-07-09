require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const session = require("express-session");
const axios = require("axios");

app.use(
  session({
    secret: "mysecret", // Replace with your own secret
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const client_id = "78c2aq8oqxkd1b";
const client_secret = "vYctd4jo4bad3n14";
const redirect_uri = "http://localhost:9000/auth/linkedin/callback";
const scope = "w_member_social";

// Generate a random state string
function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

app.get("/auth/linkedin", (req, res) => {
  const state = generateState();
  req.session.state = state; // Store the state in the session

  const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;
  console.log(`Generated state: ${state}`);
  res.redirect(authURL);
});

app.get("/auth/linkedin/callback", async (req, res) => {
  const { code, state } = req.query;

  console.log(`Received state: ${state}`);
  console.log(`Session state: ${req.session.state}`);

  // Verify the state value
  if (!req.session.state || req.session.state !== state) {
    return res.status(400).send("Invalid state parameter");
  }

  const tokenURL = "https://www.linkedin.com/oauth/v2/accessToken";

  try {
    const response = await axios.post(tokenURL, null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id,
        client_secret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    res.status(200).json({ accessToken });
    

  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving access token");
  }
});

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
const mediumApi = require("./routes/mediumApi");
const hashnodeApi = require("./routes/hashnodeApi");
const linkedinPost = require("./routes/linkedinPost");

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
