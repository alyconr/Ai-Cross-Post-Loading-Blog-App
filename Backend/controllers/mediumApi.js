const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const pool = require("../db/connect");
const Parser = require("rss-parser");
const postMediumApi = async (req, res) => {
  try {
    const { title, content, tags, publishStatus, mediumToken } = req.body;
    const mediumToEndpoint = "https://api.medium.com/v1/me";

    const { data } = await axios.get(mediumToEndpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mediumToken}`,
      },
    });

    const userId = data.data.id;

    const postMediumEndpoint = `https://api.medium.com/v1/users/${userId}/posts`;

    console.log("Received article data:", {
      title,
      content,
      tags,
      publishStatus,
      mediumToken,
    });

    const article = {
      title,
      contentFormat: "markdown",
      content,
      tags,
      publishStatus,
    };

    const response = await axios.post(postMediumEndpoint, article, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mediumToken}`,
      },
    });

    res.status(StatusCodes.OK).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const getMediumPosts = async (req, res) => {
  const { userId } = req.params;
  const parser = new Parser();
  try {
    const mediumToEndpoint = "https://api.medium.com/v1/me";

    const mediumToken = await getMediumTokenFromDb(userId);

    if (!mediumToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Medium API key is required" });
    }

    const response = await axios.get(mediumToEndpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mediumToken}`,
      },
    });

    const userMedium = response.data.data.username;
    const rssMedium = `https://medium.com/feed/@${userMedium}`;

    // Parse the RSS feed
    try {
      const feed = await parser.parseURL(rssMedium);

      // Transform the feed items to match your desired output
      const posts = feed.items.map((item) => ({
        title: item.title,
        pubDate: item.pubDate,
        link: item.link,
        guid: item.guid,
        author: item.creator,
        thumbnail: item.enclosure ? item.enclosure.url : "",
        description: item.content,
        content: item.content,
        categories: item.categories || [],
      }));

      res.status(StatusCodes.OK).json(posts);
    } catch (parseError) {
      console.error("Error parsing RSS feed:", parseError);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Unable to parse RSS feed" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const getMediumTokenFromDb = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT `MediumToken` FROM users WHERE `id` = ?";

    const values = [userId];
    pool.query(sql, values, (queryError, result) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        reject(queryError);
      } else {
        resolve(result[0].MediumToken);
      }
    });
  });
};

module.exports = { postMediumApi, getMediumPosts };
