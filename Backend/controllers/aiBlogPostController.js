require("dotenv").config();
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { QdrantVectorStore } = require("@langchain/qdrant");

const axios = require("axios");
const cheerio = require("cheerio");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const  { google }   = require("googleapis");
const { Document } = require("langchain/document");

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

function sanitizeCollectionName(name) { 
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

const generateBlogPost = async (req, res) => {
  try {
    const { keyword, numReferences, openAiApiKey } = req.body;
    console.log(keyword, numReferences, openAiApiKey);

    if (!keyword || !numReferences || !openAiApiKey) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (numReferences > 10) {
      return res
        .status(400)
        .json({ error: "Maximum number of references is 10" });
    }
    //1. Document loading (webscrapping)

    const searchResults = await searchGoogle(keyword, numReferences);

    const documents = await loadDocuments(searchResults);

    //2. splitting

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(documents);

    //3. embedding

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiApiKey });

 

    const collectionName = sanitizeCollectionName(`blogposts_${new Date().getTime()}`);

    //create Qdrant client
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 1536,
        distance: "Cosine",
      },
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        client: qdrantClient,
        collectionName: collectionName,
      }
    );

    //4 Retrieval QA chain

    const retriever = vectorStore.asRetriever();
    const relevantDocs = await retriever.invoke(keyword);

    //5. Blog post generation

    const model = new ChatOpenAI({
      openAIApiKey: openAiApiKey,
      temperature: 0.7,
      modelName: "gpt-3.5-turbo",
    });

    const prompt =  ChatPromptTemplate.fromTemplate(`
            Given the following information, generate a blog post
      Write a full blog post that will rank for the following keywords: {keyword}
      
      Instructions:
      {instructions}
      
      Context:
      {context}
            `);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      keyword,
      instructions: getInstructions(),
      context: relevantDocs.map((doc) => doc.pageContent).join("\n\n"),
    });

    // Clean up by deleting the collection after use
    await qdrantClient.deleteCollection(collectionName);

    return res.status(200).json({ blogPost: response.content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const searchGoogle = async (keyword, numResults) => {
  try {
    const customsearch = google.customsearch('v1');
    const result = await customsearch.cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: keyword,
      num: numResults
    });

    return result.data.items.map(item => item.link);
  } catch (error) {
    console.error("Error searching Google:", error);
    throw new Error("Failed to search Google");
  }
};

const loadDocuments = async (urls) => {
  const documents = [];

  for (const url of urls) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);
      const text = $("body").text();
      documents.push({
        pageContent: text,
        metadata: { source: url },
      });
    } catch (error) {
      console.error(`Error loading document from ${url}:`, error);
    }
  }
  return documents;
};

const getInstructions = () => {
  return `
      The blog should be properly and beautifully formatted using markdown.
      The blog title should be SEO optimized.
      The blog title should be crafted with the keyword in mind and should be catchy and engaging. But not overly expressive.
      Generate a title that is concise and direct. Avoid using introductory phrases like 'Exploring' or 'Discover'.
      Do not include : in the title.
      Each sub-section should have at least 3 paragraphs.
      Each section should have at least three subsections.
      Sub-section headings should be clearly marked.
      Clearly indicate the title, headings, and sub-headings using markdown.
      Each section should cover the specific aspects as outlined.
      For each section, generate detailed content that aligns with the provided subtopics. Ensure that the content is informative and covers the key points.
      Ensure that the content is consistent with the title and subtopics. Do not mention an entity in the title and not write about it in the content.
      Ensure that the content flows logically from one section to another, maintaining coherence and readability.
      Where applicable, include examples, case studies, or insights that can provide a deeper understanding of the topic.
      Always include discussions on ethical considerations, especially in sections dealing with data privacy, bias, and responsible use. Only add this where it is applicable.
      In the final section, provide a forward-looking perspective on the topic and a conclusion.
      Please ensure proper and standard markdown formatting always.
      Make the blog post sound as human and as engaging as possible, add real world examples and make it as informative as possible.
      Each blog post should have at least 5 sections with 3 sub-sections each.
      Each sub section should have at least 3 paragraphs.
    `;
};

module.exports = {
  generateBlogPost,
};
