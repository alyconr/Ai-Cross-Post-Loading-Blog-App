require("dotenv").config();
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { QdrantVectorStore } = require("@langchain/qdrant");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");

const axios = require("axios");
const cheerio = require("cheerio");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { google } = require("googleapis");
const { Document } = require("langchain/document");
const { postProcessBlogPost } = require("../Helpers/postProcessBlogPost.js");

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

function sanitizeCollectionName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, "_");
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

    if (documents.length === 0) {
      return res.status(400).json({ error: "No documents found" });
    }

    //2. splitting

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(documents);

    //3. embedding

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiApiKey });

    const collectionName = sanitizeCollectionName(
      `blogposts_${new Date().getTime()}`
    );

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
      modelName: "gpt-4-turbo",
    });

    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");
    const sourceTitles = documents.map((doc) => doc.metadata.title).join("\n");
    const sourceDescriptions = documents
      .map((doc) => doc.metadata.metaDescription)
      .filter(Boolean)
      .join("\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a professional blog writer tasked with creating a comprehensive, SEO-optimized blog post on the topic: {keyword}
      
        Use the following information as context:
        {context}
      
        Consider these relevant article titles for inspiration:
        {sourceTitles}
      
        And these meta descriptions for SEO insights:
        {sourceDescriptions}
      
        Please follow these detailed instructions:
        {instructions}
      
        Additional Guidelines:
        1. Start with a compelling introduction that hooks the reader and outlines what the post will cover.
        2. Use the following markdown structure for your post:
           # Main Title (Include the primary keyword)
           ## Main Section 1
           ### Subsection 1.1
           (Content with at least 8 paragraphs...)
           ### Subsection 1.2
           (Content with at least 8 paragraphs...)
           ### Subsection 1.3
           (Content with at least 8 paragraphs...)
           ## Main Section 2
           (and so on...)
        3. You MUST have at least 5 main sections (##) and EXACTLY 3 subsections (###) under each main section.
        4. Each subsection MUST contain at least 8 paragraphs of detailed, valuable content. No exceptions.
        5. Include at least one code example in each main section, using proper markdown code block formatting. For example:
           \`\`\`javascript
           const example = "This is a code example";
           console.log(example);
           \`\`\`
        6. Suggest places for images or diagrams with descriptions of what they should illustrate, formatted like this:
           [Image suggestion: Description of the image]
        7. Use inline citations [1], [2], etc., when referencing specific information from the sources.
        8. Conclude with a summary of key points and a call-to-action for the reader.
        9. After the conclusion, provide 3-5 meta description options for the blog post, each under 160 characters.
      
        Remember, the goal is to create an in-depth, authoritative post that provides real value to the reader while also being optimized for search engines. Make the content engaging, informative, and well-structured.
      
        Do not include a table of contents or a reference list - these will be added automatically in post-processing.
      `);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      keyword,
      context,
      instructions: getInstructions(),
      sourceTitles,
      sourceDescriptions,
    });

   
   
    // Clean up by deleting the collection after use
    await qdrantClient.deleteCollection(collectionName);

    const blogPost = postProcessBlogPost(response.content, documents);

    if (!blogPost) {
      console.error("Invalid blog post provided to postProcessBlogPost");
      return res.status(500).json({ error: "Failed tod process blog post" });
    }

    return res.status(200).json({ blogPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const searchGoogle = async (keyword, numResults) => {
  try {
    const customsearch = google.customsearch("v1");
    const result = await customsearch.cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: keyword,
      num: numResults,
    });

    return result.data.items.map((item) => item.link);
  } catch (error) {
    console.error("Error searching Google:", error);
    throw new Error("Failed to search Google");
  }
};

const loadDocuments = async (urls) => {
  const documents = [];
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (const url of urls) {
    try {
      await delay(1000);
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Cache-Control": "max-age=0",
        },
        timeout: 10000,
      });

      // Use Readability for main content extraction
      const dom = new JSDOM(data, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      // Use Cheerio for specific element extraction
      const $ = cheerio.load(data);
      const metaDescription = $('meta[name="description"]').attr("content");
      const h1 = $("h1").first().text();

      if (article) {
        documents.push({
          pageContent: article.textContent,
          metadata: {
            source: url,
            title: article.title || h1,
            excerpt: article.excerpt,
            metaDescription: metaDescription,
          },
        });
        console.log(`Successfully scraped and parsed ${url}`);
      } else {
        // Fallback to Cheerio if Readability fails
        const bodyText = $("body").text();
        documents.push({
          pageContent: bodyText,
          metadata: {
            source: url,
            title: h1,
            metaDescription: metaDescription,
          },
        });
        console.log(`Parsed ${url} using fallback method`);
      }
    } catch (error) {
      console.error(`Error loading document from ${url}:`, error.message);
    }
  }
  return documents;
};

const getInstructions = () => {
  return `
    1. Structure and Formatting:
       - Use proper markdown formatting throughout the blog post.
       - Structure the blog post with this exact hierarchy:
         # Main Title (only one, at the top)
         ## Main Sections (EXACTLY 5)
         ### Subsections (EXACTLY 3 per main section)
       - Do not create a table of contents manually; it will be generated automatically.
       - Each subsection MUST have EXACTLY 5 paragraphs of detailed, informative content. No exceptions.

    2. Content Quality:
       - The blog post should be comprehensive, informative, and engaging.
       - Use a professional tone while keeping the content accessible to a general audience.
       - Include real-world examples, case studies, or practical applications in every main section.
       - Provide at least one code example in each main section and explain it thoroughly.

    3. SEO Optimization:
       - Craft an SEO-optimized title that includes the main keyword.
       - Use the main keyword and related terms naturally throughout the content.
       - Include meta description suggestions that are compelling and include the main keyword.

    4. Specific Content Requirements:
       - In the introduction, clearly state the purpose of the blog post and what readers will learn.
       - For each main section:
         * Begin with a brief overview of what the section will cover.
         * Ensure smooth transitions between subsections.
         * Conclude with a summary of key points.
       - Include a "Best Practices" or "Tips and Tricks" section as one of the main sections.
       - Address common questions or misconceptions related to the topic in each main section.

    5. Technical Considerations:
       - Include at least one code snippet in each main section, using proper markdown code block formatting.
       - Explain any technical terms or jargon that may not be familiar to all readers.
       - If discussing tools or libraries, mention version numbers where relevant.

    6. Visual Elements:
       - Suggest places for images or diagrams in each main section, describing what these visual elements should illustrate.
       - Format image suggestions like this: [Image suggestion: Description of the image]

    7. References and Citations:
       - Cite sources for specific facts, statistics, or quotes using inline citations [1], [2], etc.

    8. Engagement:
       - Use rhetorical questions, analogies, or thought-provoking statements to keep the reader engaged.
       - Encourage reader interaction where appropriate, such as suggesting they try out a technique or share their experiences.

    Remember, the goal is to create a comprehensive, well-structured, and valuable resource for the reader while optimizing for search engines. Strictly adhere to the structure and content requirements.
  `;
};

module.exports = {
  generateBlogPost,
};
