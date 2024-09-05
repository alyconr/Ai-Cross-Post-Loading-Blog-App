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
      temperature: 0.5,
      modelName: "gpt-4-turbo",
    });

    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");
    const sourceTitles = documents.map((doc) => doc.metadata.title).join("\n");
    const sourceDescriptions = documents
      .map((doc) => doc.metadata.metaDescription)
      .filter(Boolean)
      .join("\n");

      const getInstructions = () => {
        return `
          1. Structure:
             - Main Title: 1 (Use the given keyword, prefixed with a single #)
             - Main Sections: Exactly 5 (prefixed with ##)
             - Subsections: Exactly 3 per main section (prefixed with ###)
             - Paragraphs: Exactly 8 per subsection
             - Code Examples: At least 1 per subsection
      
          2. Content Generation Steps:
             a. Start with the main title using a single #
             b. Create exactly 5 main sections using ##
             c. Under each main section, create exactly 3 subsections using ###
             d. For each subsection:
                - Write exactly 8 paragraphs
                - Include at least one relevant code example
                - After each paragraph, add a comment: <!-- Paragraph X -->
                - Ensure the code example is practical and explained thoroughly
             e. Use markdown formatting throughout
             f. Use clear, descriptive titles for sections and subsections
             g. Do not add any anchor links or HTML tags to the content
      
          3. SEO Optimization:
             - Use the main keyword in the title and naturally throughout the content
             - Optimize headings (##, ###) with relevant keywords
      
          4. Engagement:
             - Use a professional yet conversational tone
             - Include real-world examples or case studies in each subsection
             - Suggest image placements with descriptions: [Image: Description]
      
          5. Conclusion:
             - Add a ## Conclusion section at the end
             - Summarize key points
             - Include a call-to-action
      
          6. After the conclusion:
             - Add a ## Meta Description Options section
             - Provide 3-5 meta description options (under 160 characters each)
      
          CRITICAL: Follow the structure exactly. Each subsection MUST have 8 paragraphs and at least one code example. No exceptions. Do not add any additional headings or sections beyond what is specified here.
        `;
      };
      
      const prompt = ChatPromptTemplate.fromTemplate(`
      You are a professional blog writer creating a comprehensive, SEO-optimized post on: {keyword}
      
      Context: {context}
      Relevant Titles: {sourceTitles}
      SEO Insights: {sourceDescriptions}
      
      Instructions: {instructions}
      
      Follow this exact structure:
      
      # Main Title (Use the keyword)
      
      ## Main Section 1
      ### Subsection 1.1
      (Exactly 8 paragraphs with paragraph comments, at least one code example)
      ### Subsection 1.2
      (Exactly 8 paragraphs with paragraph comments, at least one code example)
      ### Subsection 1.3
      (Exactly 8 paragraphs with paragraph comments, at least one code example)
      
      ## Main Section 2
      (Continue this pattern for all 5 main sections)
      
      ## Conclusion
      (Summary and call-to-action)
      
      ## Meta Description Options
      (3-5 options)
      
      CRITICAL REMINDERS:
      1. You MUST have EXACTLY 5 main sections (##) and 3 subsections (###) per main section.
      2. Each subsection MUST have EXACTLY 8 paragraphs. Use comments to track: <!-- Paragraph 1 -->, <!-- Paragraph 2 -->, etc.
      3. Each subsection MUST include at least one code example.
      4. Explain all code examples thoroughly.
      5. Do not skip or combine any sections or subsections.
      6. Use clear, descriptive titles for all sections and subsections.
      7. Do not add any additional headings or sections beyond what is specified in the structure.
      8. Do not add any HTML tags or anchor links to the content.
      
      Generate the blog post now, following this structure exactly.
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

module.exports = {
  generateBlogPost,
};
