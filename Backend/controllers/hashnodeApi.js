const { StatusCodes } = require("http-status-codes");

const postHashnodeApi = async (req, res) => {
  try {
    const {
      publicationId,
      title,
      subtitle,
      contentMarkdown,
      coverImageOptions,
      tags,
      hashnodeApiKey,
    } = req.body;

    const hashnodeEndpoint = "https://gql.hashnode.com";

    console.log("Received article data:", {
      publicationId,
      title,
      subtitle,
      contentMarkdown,
      coverImageOptions,
      tags,
      hashnodeApiKey,
    });

    const postMutation = `
        mutation ($input: PublishPostInput!) {
             publishPost(input: $input) {
                post {
                 url
                }
            }
        } `;

    const variables = {
      input: {
        publicationId,
        title,
        subtitle,
        contentMarkdown,
        coverImageOptions,
        tags,
      },
    };

    const response = await fetch(hashnodeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: hashnodeApiKey,
      },
      body: JSON.stringify({
        query: postMutation,
        variables,
      }),
    });

    const data = await response.json();

    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
};

module.exports = { postHashnodeApi };
