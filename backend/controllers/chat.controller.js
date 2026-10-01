const { searchSimilarChunks } = require("../dbFunctions/document");
const { generateText, generateEmbeddings, generateEmbeddingForQuestion } = require("../services/llm.service");
const getPrompt = require("../utils/getPrompt");


const sendMessage = async (req, res) => {
  const { message } = req.body;

  // Tell frontend we're streaming newline-delimited JSON
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send headers immediately
  res.flushHeaders();

  try {
    const stream = await generateText(message);

    for await (const event of stream) {
      //   console.log(event);

      // Send event immediately to frontend
      res.write(JSON.stringify(event) + '\n');
    }

    // Signal that HTTP stream is finished
    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      JSON.stringify({
        type: 'error',
        message: error.message,
      }) + '\n'
    );

    res.end();
  }
};


const findAnswer = async (req, res) => {
  const { message } = req.body;

  // Tell frontend we're streaming newline-delimited JSON
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send headers immediately
  res.flushHeaders();

  try {

    const questionEmbedding = await generateEmbeddingForQuestion(message);

    if (!questionEmbedding || questionEmbedding.length === 0) {
      throw new Error('Failed to generate embedding for the question');
    }

    const chunks = await searchSimilarChunks(questionEmbedding,5);
    
    if (!chunks || chunks.length === 0) {
      throw new Error('No similar chunks found in the database');
    }

    const context = chunks.map(chunk => chunk.text).join('\n');
    

    const stream = await generateText(getPrompt(context, message));

    for await (const event of stream) {
        console.log(event);

      // Send event immediately to frontend
      res.write(JSON.stringify(event) + '\n');
    }
    
    // Signal that HTTP stream is finished
    res.end();
  } catch (error) {
    console.error(error);

    res.write(
      JSON.stringify({
        type: 'error',
        message: error.message,
      }) + '\n'
    );

    res.end();
  }
};

module.exports = {
  sendMessage,
  findAnswer,
};