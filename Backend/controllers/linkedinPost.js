require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

const postLinkedin = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1]; // Bearer YOUR_ACCESS_TOKEN
    const { title, content } = req.body;
  
    const postURL = 'https://api.linkedin.com/v2/ugcPosts';
    const postBody = {
      "author": "urn:li:organization:11757782",
      "lifecycleState": "PUBLISHED",
      "specificContent": {
          "com.linkedin.ugc.ShareContent": {
              "media": [
                  {
                      "media": "urn:li:digitalmediaAsset:C5500AQG7r2u00ByWjw",
                      "status": "READY",
                      "title": {
                          "attributes": [],
                          "text": title
                      }
                  }
              ],
              "shareCommentary": {
                  "attributes": [],
                  "text": content
              },
              "shareMediaCategory": "VIDEO"
          }
      },
      "visibility": {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
  };
  
    try {
      const response = await axios.post(postURL, postBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return res.status(StatusCodes.OK).send(response.data);
} catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};

module.exports = { postLinkedin };

