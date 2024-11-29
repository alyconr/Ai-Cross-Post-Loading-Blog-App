require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { HumanMessage } = require('@langchain/core/messages');

const generateSuggestions = async (req, res) => {
  try {
    const { text, openAiApiKey } = req.body;

    console.log('OpenAI API Key:', openAiApiKey);

    const chat = new ChatOpenAI({
      openAIApiKey: openAiApiKey,
      temperature: 0.7,
      modelName: 'gpt-4-turbo-preview' // Corrected model name
    });

    const template = `
        Given the following paragraph from a blog post:

        {text}

        Generate three unique paragraph continuations that would naturally follow this text. Each continuation should:
        - Be between 100-150 words
        - Maintain the same writing style and tone
        - Add valuable information or insights
        - Flow naturally from the given text

        Format as three distinct paragraphs.`;

    const prompt = new PromptTemplate({
      template,
      inputVariables: ['text']
    });

    const formattedPrompt = await prompt.format({ text });

    // Create a HumanMessage with the formatted prompt
    const message = new HumanMessage(formattedPrompt);

    // Use invoke with the message
    const response = await chat.invoke([message]);

    // Extract the content from the AI's response
    const suggestions = response.content.split('\n\n').filter((p) => p.trim());

    res.json({ suggestions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateSuggestions
};
