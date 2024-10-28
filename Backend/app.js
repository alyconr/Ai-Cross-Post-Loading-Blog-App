require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const app = express();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const bodyParser = require("body-parser");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json({ limit: "50" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Helper function to upload to S3
async function uploadToS3(buffer, filename, contentType) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${filename}`,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read', // Make the file publicly accessible
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${filename}`;

  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}


// Modified upload endpoint with cloud storage
app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = Date.now() + path.extname(file.originalname);
  
  try {
    // Process image with Sharp
    const processedImageBuffer = await sharp(file.buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to S3
    const fileUrl = await uploadToS3(
      processedImageBuffer,
      filename,
      'image/jpeg'
    );
  

    return res.status(200).json({
      filename,
      url: fileUrl
    });

  } catch (error) {
    console.error("Error processing or uploading image:", error);
    return res.status(500).json({ error: "Error processing or uploading image" });
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
const { connectors } = require("googleapis/build/src/apis/connectors");

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
