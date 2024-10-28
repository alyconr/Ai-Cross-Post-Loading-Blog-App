require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const pool = require("../db/connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const experiesAt = new Date();
  experiesAt.setHours(experiesAt.getHours() + 1); // expires in 1 hour
  return { token, experiesAt };
};

const register = async (req, res) => {
  const sql =
    "SELECT * FROM users WHERE  fullname=? or username = ? or email = ?  ";

  pool.query(
    sql,
    [req.body.fullname, req.body.username, req.body.email],
    (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Database query error" });
      }

      if (results.length > 0) {
        if (results[0].email === req.body.email) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Email already exists" });
        }

        if (results[0].username === req.body.username) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Username already exists" });
        }
      }

      // validate password at least 8 characters long and contains at least one number and one special character

      const passwordRegex =
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

      if (!passwordRegex.test(req.body.password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error:
            "Password must be at least 8 characters long and contain at least one number and one special character",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const sql =
        "INSERT INTO users (fullname, username, email, password) VALUES(?,?,?,?)";
      pool.query(
        sql,
        [req.body.fullname, req.body.username, req.body.email, hash],
        (queryError, results) => {
          if (queryError) {
            console.error("Database query error:", queryError);
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ error: "Database query error" });
          }

          res.status(StatusCodes.CREATED).json({
            message: "User created successfully",
            user: {
              id: results.insertId,
              fullname: req.body.fullname,
              username: req.body.username,
              email: req.body.email,
            },
          });
        }
      );
    }
  );
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const { token, experiesAt } = generateResetToken();

  const sql = "SELECT * FROM users WHERE email = ?";

  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Email is required",
    });
  }

  pool.query(sql, [email], (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "An internal server error occurred. Please try again later.",
      });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User's email not found" });
    }

    const updateTokenSql =
      "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE email = ?";

    pool.query(
      updateTokenSql,
      [token, experiesAt, email],
      (queryError, results) => {
        if (queryError) {
          console.error("Database query error:", queryError);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Database query error" });
        }

        // Send the reset token to the user's email

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Password Reset",
          html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ error: "Error sending email" });
          }

          console.log("Email sent:", info.response);
          res
            .status(StatusCodes.OK)
            .json({ message: "Password reset link sent successfully" });
        });
      }
    );
  });
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    // Check if the email and password are provided
    if (!email || !password || !token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Email, password, and reset token are required",
      });
    }

    // check if email exists in database
    const emailCheckSql = "SELECT * FROM users WHERE email = ?";

    pool.query(emailCheckSql, [email], (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "An internal server error occurred. Please try again later.",
        });
      }

      if (results.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "User's email not found" });
      }

      // Check if the reset token is valid
      const checkTokenSql =
        "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires_at > NOW()";

      console.log("Query:", checkTokenSql, [email, token]);

      pool.query(checkTokenSql, [email, token], (queryError, results) => {
        if (queryError) {
          console.error("Database query error:", queryError);
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Database query error" });
        }

        if (results.length === 0) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid or expired reset token" });
        }

        const passwordRegex =
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!passwordRegex.test(password)) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            error:
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Update the user's password and clear the reset token
        const updatePasswordSql =
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE email = ?";

        pool.query(
          updatePasswordSql,
          [hashedPassword, email],
          (updateError, updateResults) => {
            if (updateError) {
              console.error("Database update error:", updateError);
              return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Database update error" });
            }

            return res.status(StatusCodes.OK).json({
              message: "Password reset successfully",
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error while resetting the password",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "All fields are required, please provide email and password",
    });
  }

  pool.query(sql, [email], (queryError, results) => {
    if (queryError) {
      console.error("Database query error:", queryError);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        image: user.image,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(StatusCodes.OK)
      .json({
        message: "User logged in successfully",
        user: {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          image: user.image,
          token,
        },
      });
  });
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    domain: "localhost",
    path: "/",
  });
  return res
    .status(StatusCodes.OK)
    .json({ message: "User logged out successfully" });
};

module.exports = {
  register,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
};
