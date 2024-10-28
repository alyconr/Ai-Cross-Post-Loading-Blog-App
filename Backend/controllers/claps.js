require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const createClap = async (req, res) => {
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
    "INSERT INTO claps (`user_id`, `post_id`, `applause_count` ) VALUES (?, ?, ?)";

  const values = [decoded.id, req.body.post_id, req.body.applause_count];

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

const getPostClaps = async (req, res) => {
  const sql =
    "SELECT SUM(claps.applause_count) AS total_claps FROM claps WHERE post_id = ?";

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

const getUserClaps = async (req, res) => {
  const sql =
    "SELECT posts.id,   `fullname`, users.image AS userImage, SUM(claps.applause_count) AS total_claps FROM claps " +
    "JOIN users ON claps.user_id = users.id " +
    "JOIN posts ON claps.post_id = posts.id " +
    "WHERE posts.id = ? " +
    "GROUP BY posts.id,  `fullname` , users.image";

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

module.exports = {
  createClap,
  getPostClaps,
  getUserClaps,
};
