const { StatusCodes } = require("http-status-codes");
const pool = require("../db/connect");

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
      draft,
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
      draft,
    });

    const postMutation = `
        mutation ($input: PublishPostInput!) {
             publishPost(input: $input) {
                post {
                 url
                }
            }
        } `;

    const draftMutation = `
        mutation ($input: CreateDraftInput!) {
             createDraft(input: $input) {
                draft {
                 id
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
        query: draft === true ? draftMutation : postMutation,
        variables: variables,
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

const getHashnodePosts = async (req, res) => {
  try {
    const hashnodeEndpoint = "https://gql.hashnode.com";

    const hashNodeToken = await getHashnodeTokenFromDb(req.params.userId);

    const userQuery = `
    query  {
        me {
            username            
        }
    }

    `;

    const userResponse = await fetch(hashnodeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: hashNodeToken,
      },
      body: JSON.stringify({
        query: userQuery,
      }),
    });

    const userData = await userResponse.json();
    const username = userData.data.me.username;
    const host = `${username}.hashnode.dev`;
    // conver hosts to lowercase

    const query = `
        query ($host: String!) {
            publication(host: $host) {
                title
                author {
                    name
                }
                posts (first: 10) {
                    edges {
                        node {
                            title,
                            subtitle,
                            
                        }
                    }
                }
        }
} `;

    const variables = {
      host: host.toLowerCase(),
    };

    const postResponse = await fetch(hashnodeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const postData = await postResponse.json();
    
    res.status(StatusCodes.OK).json(postData.data.publication.posts.edges);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }
};

const getHashnodeTokenFromDb = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT `HashNodeToken`  FROM users WHERE `id` = ?";

    const values = [userId];

    pool.query(sql, values, (queryError, results) => {
      if (queryError) {
        console.error("Database query error:", queryError);
        reject(queryError);
      } else {
        resolve(results[0].HashNodeToken);
      }
    });
  });
};

module.exports = { postHashnodeApi, getHashnodePosts };
