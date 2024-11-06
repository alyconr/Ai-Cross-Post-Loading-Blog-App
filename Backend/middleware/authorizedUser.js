const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authorizedUser = (req, res, next) => {
  const token = req.cookies.token;
 

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const { username: urlUsername } = req.params;
  console.log(urlUsername, decoded.username);

  if (urlUsername !== decoded.username) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  // if the user is authorized, call the next function (updateUser)

  next();
};

const authorized = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const { userId: urlUserId } = req.params;

  

  if (parseInt(urlUserId) !== decoded.id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized " });
  }

  next();
};


const apiAuthorized = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  

  next();
};
module.exports = { authorizedUser, authorized, apiAuthorized }; //authorizedUser ; // authorizedUser;
