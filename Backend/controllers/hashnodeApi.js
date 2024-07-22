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
      host: "alyconrdev.hashnode.dev",
    };
    
    const response = await fetch(hashnodeEndpoint, {
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
    
    const data = await response.json();
    
    res.status(StatusCodes.OK).json(data);
    
    
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An internal server error occurred. Please try again later.",
    });
  }



}

module.exports = { postHashnodeApi, getHashnodePosts };
