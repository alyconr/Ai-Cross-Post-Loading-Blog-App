require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const createBookmark = async (req, res) => {
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

  const sql = "INSERT INTO bookmarks (`usersId`, `postsId`) VALUES (?, ?)";

  const values = [req.body.usersId, req.body.postsId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Bookmark created successfully" });
    }
  });
};

const getAllBookmarks = async (req, res) => {
  const sql = `
  SELECT 
    posts.id, 
    posts.title, 
    posts.description, 
    posts.image, 
    author.username AS author_username, 
    author.fullname AS author_fullname, 
    posts.uid,
    bookmarks.usersId AS current_usersId
  FROM 
    bookmarks 
    JOIN posts ON bookmarks.postsId = posts.id 
    JOIN users ON bookmarks.usersId = users.id 
    JOIN users AS author ON posts.uid = author.id

  WHERE 
    users.id = ?`;
  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json(results);
    }
  });
};

const deleteBookmark = async (req, res) => {
  const sql = "DELETE FROM bookmarks WHERE usersId = ? AND postsId = ?";
  const values = [req.body.usersId, req.body.postsId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Bookmark deleted successfully" });
    }
  });
};

module.exports = {
  createBookmark,
  getAllBookmarks,
  deleteBookmark,
};
