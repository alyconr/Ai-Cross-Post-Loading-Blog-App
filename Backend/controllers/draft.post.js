const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const getAllDraftPosts = async (req, res) => {
  const sql = "SELECT * FROM posts_draft";

  pool.query(sql, [], (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      const posts = results.map((post) => ({
        ...post,
        tags: JSON.parse(post.tags),
      }));
      res.status(StatusCodes.OK).json({ posts });
    }
  });
};

const createDraftPost = async (req, res) => {
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
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized invalid token" });
  }
  const tagsString = JSON.stringify(req.body.tags);
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

  const sql =
    "INSERT INTO posts_draft(`title`, `description`, `content`,	 `image`, `date`,`userId`, `category`, `tags` ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ post: results.insertId });
    }
  });
};

const updateDraftPost = async (req, res) => {
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
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized invalid token" });
  }
  const tagsString = JSON.stringify(req.body.tags);
  const values = [
    req.body.title,
    req.body.description,
    req.body.content,
    req.body.image,
    req.body.date,
    decoded.id,
    req.body.category,
    tagsString,
    req.params.id,
  ];

  const sql =
    "UPDATE posts_draft SET `title` = ?, `description` = ?, `content` = ?, `image` = ?, `date` = ?, `userId` = ?, `category` = ?, `tags` = ? WHERE `draft_id` = ?";

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ post: results.insertId });
    }
  });
};

const getSingleDraftPost = async (req, res) => {
  const values = [req.params.id];
  const sql = "SELECT posts_draft.* FROM posts_draft WHERE draft_id = ?";

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      if (results.length > 0) {
        const post = {
          ...results[0],
          tags: JSON.parse(results[0].tags),
        };
        res.status(StatusCodes.OK).json({ post });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Post not found" });
      }
    }
  });
};


const deleteDraftPostById = async (req, res) => {
  const values = [req.params.id];
  const sql = "DELETE FROM posts_draft WHERE draft_id = ?";

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Draft Post deleted successfully" });
    }
  });

}

const deleteDraftPost = async (req, res) => {
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
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized invalid token" });
  }

  const sql = "DELETE  FROM posts_draft";

  pool.query(sql, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Draft Post deleted successfully" });
    }
  });
};

module.exports = {
  getAllDraftPosts,
  createDraftPost,
  updateDraftPost,
  getSingleDraftPost,
  deleteDraftPost,
  deleteDraftPostById
}; // export getAllDraftPosts
