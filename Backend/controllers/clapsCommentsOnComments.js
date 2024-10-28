const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const pool = require("../db/connect");

const clapsCommentsOnComments = async (req, res) => {
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
    "INSERT INTO claps_commentOnComments (`userCommentId`, `commentOnCommentId`, `applauseCommentOnComment` ) VALUES (?, ?, ?)";

  const values = [
    decoded.id,
    req.body.commentOnCommentId,
    req.body.applauseCommentOnComment,
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

const getTotalClapsCommentsOnComments = async (req, res) => {
  const sql = `
    SELECT SUM(claps_commentOnComments.applauseCommentOnComment) AS total_claps
    FROM claps_commentOnComments
    WHERE commentOnCommentId = ?
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

const getUsersClapsCommentsOnComments = async (req, res) => {
  const sql = `
    SELECT commentOnCommentId, claps_commentOnComments.userCommentId, users.username, users.image AS userImage, SUM (claps_commentOnComments.applauseCommentOnComment) AS total_claps
    FROM claps_commentOnComments
    JOIN users ON claps_commentOnComments.userCommentId = users.id
    WHERE commentOnCommentId = ?
    GROUP BY claps_commentOnComments.userCommentId, users.username, users.image
`;

  const values = [req.params.id];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res.status(StatusCodes.OK).json({ users: results });
    }
  });
};

module.exports = {
  clapsCommentsOnComments,
  getTotalClapsCommentsOnComments,
  getUsersClapsCommentsOnComments,
};
