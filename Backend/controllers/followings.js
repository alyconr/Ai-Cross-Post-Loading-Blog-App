require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");


const getFollowings = async (req, res) => {
    const { id } = req.params;

    const sql =
      "SELECT users.id, `fullname`, users.username, users.image AS userImage, SUM(followers.followers_count) AS total_followers FROM followers " +
      "JOIN users ON followers.following_id = users.id " +
      "WHERE follower_id = ? " +
        "GROUP BY users.id, `fullname` , users.username, users.image";
    
    const values = [id];

    pool.query(sql, values, (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Database query error" });
      } else {
        res.status(StatusCodes.OK).json(results);
      }
    });
};
  

module.exports = { getFollowings }