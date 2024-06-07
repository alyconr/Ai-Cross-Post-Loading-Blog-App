require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const getAllPosts = async (req, res) => {
  const sql = req.query.category
    ? "SELECT * FROM posts WHERE category = ?"
    : "SELECT * FROM posts";

  const values = req.query.category ? [req.query.category] : [];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ posts: results });
    }
  });
};

const getSinglePost = async (req, res) => {
  const sql =
    "SELECT posts.id AS pid, users.id AS uid, `fullname`, `username`,  `title`, `description`,  posts.image, users.image AS userImage, `content`, `date`, `category`, `tags` FROM users JOIN posts ON users.id = posts.uid WHERE posts.id = ?";

  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      const post = { 
        ...results[0],
        tags: JSON.parse(results[0].tags),
      };

      res.status(StatusCodes.OK).json({ post });
    }
  });
};

const deletePost = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    // check if token is valid
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const sql = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

  const values = [req.params.id, decoded.id];
  ("");

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ message: "Post deleted successfully" });
    }
  });
};

const createPost = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log(decoded);

  if (!decoded) {
    // check if token is valid
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
  const tagsString = JSON.stringify(req.body.tags);

  const sql =
    "INSERT INTO posts(`title`, `description`, `Content`,	 `image`, `date`,`uid`, `Category`, `Tags` ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.title,
    req.body.description,
    req.body.content,
    req.body.image,
    req.body.date,
    decoded.id,
    req.body.category,
    tagsString,
  ];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.CREATED)
        .json({ post: results, message: "Post created successfully" });
    }
  });
};

const updatePost = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    // check if token is valid
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
  const tagsString = JSON.stringify(req.body.tags);
  const sql =
    "UPDATE posts SET `title` = ?, `description` = ?, `Content` = ?, `image` = ?,  `Category` = ?, `Tags` = ? WHERE `id` = ? AND `uid` = ?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.content,
    req.body.image,
    req.body.category,
    tagsString,
    req.params.id,
    decoded.id,
  ];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ post: results, message: "Post updated successfully" });
    }
  });
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  updatePost,
};
