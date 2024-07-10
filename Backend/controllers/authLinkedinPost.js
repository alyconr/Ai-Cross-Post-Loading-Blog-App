require("dotenv").config();
const client_id = process.env.LINKEDIN_CLIENT_ID;
const redirect_uri = process.env.LINKEDIN_REDIRECT_URI;
const scope = "openid profile email w_member_social";
const crypto = require("crypto");

function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

const authPostLinkedin = async (req, res) => {
  const state = generateState();

  const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;
  console.log(`Generated state: ${state}`);
  res.redirect(authURL);
};

module.exports = { authPostLinkedin };
