require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

const postDevtoApi = async (req, res) => {
  try {
    // Get your Dev.to API key
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

module.exports = { postDevtoApi };
