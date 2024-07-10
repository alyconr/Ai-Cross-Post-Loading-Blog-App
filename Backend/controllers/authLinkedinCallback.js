const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const authLinkedinCallback = async (req, res) => {
  const { code } = req.query;
  const tokenURL = "https://www.linkedin.com/oauth/v2/accessToken";
  const client_id = "78c2aq8oqxkd1b";
  const client_secret = "vYctd4jo4bad3n14";
  const redirect_uri = "http://localhost:9000/auth/linkedin/callback";

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
