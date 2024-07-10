const client_id = "78c2aq8oqxkd1b";
const redirect_uri = "http://localhost:9000/auth/linkedin/callback";
const scope = "w_member_social";
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
