const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const pool = require("../db/connect");

const postDevtoApi = async (req, res) => {
  try {
    const devToEndpoint = "https://dev.to/api/articles";

    const { title, body_markdown, published, main_image, tags, devToken } =
      req.body;
    const devToApiKey = devToken;

    console.log("Received article data:", {
      title,
      body_markdown,
      published,
      main_image,
      tags,
      devToken,
    });

    const article = {
      title,
      body_markdown,
      published,
      main_image,
      tags,
    };

    const response = await axios.post(
      devToEndpoint,
      JSON.stringify({
        article,
      }),
      {
        headers: {
          "api-key": devToApiKey,
          accept: "application/vnd.forem.api-v1+json",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(StatusCodes.OK).json({
      message: "Article created successfully",
      response: response.data,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getPostsDevto = async (req, res) => {
  const { userId } = req.params;

  try {
    const devToEndpoint = "https://dev.to/api/articles/me/published";
    const devToToken = await getDevTokenFromDb(userId);

    if (!devToToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Dev.to API key is required" });
    }

    const { data } = await axios.get(devToEndpoint, {
      headers: {
        "api-key": devToToken,
        accept: "application/vnd.forem.api-v1+json",
        "Content-Type": "application/json",
      },
    });
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getDevTokenFromDb = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT `devToToken` FROM users WHERE `id` = ?";
    const values = [userId];

    pool.query(sql, values, (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        reject(queryError);
      } else {
        resolve(results[0].devToToken);
      }
    });
  });
};

module.exports = { postDevtoApi, getPostsDevto };
