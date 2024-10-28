require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const createClapOnComment = async (req, res) => {
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

  const sql =
    "INSERT INTO claps_comments (`userComment_id`, `comment_id`, `applauseComment_count` ) VALUES (?, ?, ?)";
  const values = [
    decoded.id,
    req.body.comment_id,
    req.body.applauseComment_count,
  ];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ message: "Clap created successfully" });
    }
  });
};

const getUsersClapsOnComment = async (req, res) => {
  const sql = `
    SELECT comments.id, users.fullname, users.image AS userImage, SUM(claps_comments.applauseComment_count) AS total_claps
    FROM claps_comments
    JOIN users ON claps_comments.userComment_id = users.id
    JOIN comments ON claps_comments.comment_id = comments.id
    WHERE comments.id = ?
    GROUP BY comments.id, users.fullname, users.image
`;

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

getTotalClapsOnComment = async (req, res) => {
  const sql = `
    SELECT SUM(claps_comments.applauseComment_count) AS total_claps
    FROM claps_comments
    WHERE comment_id = ?
`;

  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ total_claps: results[0].total_claps });
    }
  });
};

module.exports = {
  createClapOnComment,
  getUsersClapsOnComment,
  getTotalClapsOnComment,
};
