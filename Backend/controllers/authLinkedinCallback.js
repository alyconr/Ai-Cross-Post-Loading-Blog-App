const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

require("dotenv").config();

const authLinkedinCallback = async (req, res) => {
  const { code } = req.query;
  const tokenURL = "https://www.linkedin.com/oauth/v2/accessToken";
  const client_id = process.env.LINKEDIN_CLIENT_ID;
  const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirect_uri = process.env.LINKEDIN_REDIRECT_URI;

  try {
    const response = await axios.post(tokenURL, null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const accessToken = response.data.access_token;
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving access token");
  }
};

module.exports = { authLinkedinCallback };
