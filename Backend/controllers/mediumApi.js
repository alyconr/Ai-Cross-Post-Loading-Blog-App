require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

const postMediumApi = async (req, res) => {
  try {
    const { title, content, tags, publishStatus, mediumToken } = req.body;
    const mediumToEndpoint = "https://api.medium.com/v1/me";
    const mediumApi =
      "23ace2a469e56b901f66fb8235e094b024a1ed0cbb2eeb396d5f67bcc35f5a105";

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
      mediumApi,
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
        Authorization: `Bearer ${mediumApi}`,
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

module.exports = { postMediumApi };
