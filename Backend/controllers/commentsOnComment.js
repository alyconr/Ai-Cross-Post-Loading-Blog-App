const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const createCommentsOnComment = async (req, res) => {
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
    "INSERT INTO comment_onComments ( `onComment_id`, `postId`, `fullname`,  `comment`, `date`) VALUES (?, ?, ?, ?, ?)";

  const values = [
    req.body.onComment_id,
    req.body.postId,
    decoded.fullname,
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
      res
        .status(StatusCodes.OK)
        .json({ message: "Comment created successfully" });
    }
  });
};

const getCommentsOnComments = async (req, res) => {
  const sql = "SELECT * FROM comment_onComments WHERE onComment_id = ?";

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

const deleteCommentsOnComment = async (req, res) => {
  const sql = "DELETE FROM comment_onComments WHERE id = ?";

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

const updateCommentOnComment = async (req, res) => {
  const sql = "UPDATE comment_onComments SET comment = ? WHERE id = ?";

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
  createCommentsOnComment,
  getCommentsOnComments,
  deleteCommentsOnComment,
  updateCommentOnComment,
};
