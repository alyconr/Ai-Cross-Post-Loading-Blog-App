require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const createComment = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token " });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    // check if token is valid
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const sql =
    "INSERT INTO comments (`userID`, `fullname`, `postID`, `comment`, `date`) VALUES (?, ?, ?, ?, ?)";

  const values = [
    decoded.id,
    decoded.fullname,
    req.body.postID,
    req.body.comment,
    req.body.date,
  ];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({
        message: "Comment posted successfully",
        fullname: decoded.fullname,
      });
    }
  });
};

const getComments = async (req, res) => {
  const sql = "SELECT * FROM comments WHERE postID = ?";

  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ comments: results });
    }
  });
};

const deleteComment = async (req, res) => {
  const sql = "DELETE FROM comments WHERE id = ?";

  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Comment deleted successfully" });
    }
  });
};

const updateComment = async (req, res) => {
  const sql = "UPDATE comments SET comment = ? WHERE id = ?";

  const values = [req.body.comment, req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "Comment updated successfully" });
    }
  });
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  updateComment,
};
