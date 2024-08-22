require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../db/connect");

const getAllUsers = async (req, res) => {
  const sql =
    "SELECT `fullname`, `username`, `email`,  users.image AS userImage FROM users";

  pool.query(sql, (queryError, results) => {
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

const getCurrentUser = async (req, res) => {
  const { username } = req.params;

  const sql =
    "SELECT users.id, `fullname`, `username`, `email`,  `bio`, users.image AS userImage, `company`, `location`, `social1`, `social2` FROM users WHERE username = ?";

  const values = [username];

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

const getUserPosts = async (req, res) => {
  const { username } = req.params;

  const sql =
    "SELECT *  FROM users JOIN posts ON users.id = posts.uid WHERE users.username = ?";

  const values = [username];

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

const updateUser = async (req, res) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (req.body.password && !req.body.password.match(passwordRegex)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      result:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }

  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

  const sql =
    "UPDATE users SET `fullname` = ?, `password`= ?, `bio` = ?, `image` = ?,`company` = ?, `location` = ?, `social1` = ?, `social2` = ? WHERE `username` = ?";

  const values = [
    req.body.fullname,
    hashedPassword,
    req.body.bio,
    req.body.image,
    req.body.company,
    req.body.location,
    req.body.social1,
    req.body.social2,
    req.params.username,
  ];

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

const deleteUser = async (req, res) => {
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

  const sql = "DELETE FROM users WHERE `username` = ?";

  const values = [req.params.username];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    } else {
      res
        .status(StatusCodes.OK)
        .json({ message: "User and account deleted successfully" });
    }
  });
};

const updateDevToken = async (req, res) => {
  const { userId } = req.params;
  const { devToToken } = req.body;

  if (!devToToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "DevTo token is required" });
  }

  const sql = "UPDATE users SET `devToToken` = ? WHERE `id` = ?";

  const values = [devToToken, userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "DevTo token updated successfully", devToToken });
  });
};

const updateMediumToken = async (req, res) => {
  const { userId } = req.params;
  const { mediumToken } = req.body;

  if (!mediumToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Medium token is required" });
  }

  const sql = "UPDATE users SET `mediumToken` = ? WHERE `id` = ?";

  const values = [mediumToken, userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Medium token updated successfully", mediumToken });
  });
};

const updateHashnodeToken = async (req, res) => {
  const { userId } = req.params;
  const { hashnodeToken } = req.body;
  const { hashnodePublicationId } = req.body;

  if (!hashnodeToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Hashnode token is required" });
  }

  const sql =
    "UPDATE users SET `hashnodeToken` = ?, `hashnodePublicationId` = ?  WHERE `id` = ?";

  const values = [hashnodeToken, hashnodePublicationId, userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Hashnode token and publication Id updated successfully",
      hashnodeToken,
      hashnodePublicationId,
    });
  });
};

const updateOpenAiApiKey = async (req, res) => {
  const { userId } = req.params;
  const { openAiApiKey } = req.body;

  if (!openAiApiKey) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "OpenAI API key is required" });
  }

  const sql = "UPDATE users SET `OpenAiApiKey` = ? WHERE `id` = ?";

  const values = [openAiApiKey, userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res
      .status(StatusCodes.OK) 
      .json({ message: "OpenAI API key updated successfully", openAiApiKey });
  });
};

const getOpenAiApiKey = async (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT `OpenAiApiKey` FROM users WHERE `id` = ?";

  const values = [userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({ openAiApiKey: results[0].OpenAiApiKey });
  });
};

const getDevToken = async (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT `devToToken` FROM users WHERE `id` = ?";

  const values = [userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({ devToToken: results[0].devToToken });
  });
};

const getMediumToken = async (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT `MediumToken` FROM users WHERE `id` = ?";

  const values = [userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({ mediumToken: results[0].MediumToken });
  });
};

const getHashnodeToken = async (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT `HashNodeToken`, `HashnodePublicationId` FROM users WHERE `id` = ?";

  const values = [userId];

  pool.query(sql, values, (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    res.status(StatusCodes.OK).json({
      hashnodeToken: results[0].HashNodeToken,
      hashnodePublicationId: results[0].HashnodePublicationId,
    });
  });
};

const getApiKeys = async (req, res) => {
  const { userId } = req.params;

  const sql =
    "SELECT users.id, `DevToToken`, `MediumToken`, `HashNodeToken`, `HashnodePublicationId` FROM users WHERE `id` = ?";

  const values = [userId];

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
  getCurrentUser,
  updateUser,
  getUserPosts,
  getAllUsers,
  deleteUser,
  updateDevToken,
  updateMediumToken,
  updateHashnodeToken,
  updateOpenAiApiKey,
  getOpenAiApiKey,
  getMediumToken,
  getDevToken,
  getHashnodeToken,
  getApiKeys,
};
