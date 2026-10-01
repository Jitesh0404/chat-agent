const { GoogleGenAI } = require('@google/genai');


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const generateText = async (message) => {
  try {
    return await ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: message,
      stream: true,
    });
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
};


const generateEmbeddings = async (
  texts
) => {
  
  const validTexts = texts.filter(
    (text) => typeof text === "string" && text.trim().length > 0
  );

  if (validTexts.length === 0) {
    return [];
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: validTexts,
  });

  if (!response.embeddings) {
    throw new Error("Failed to generate embeddings");
  }

  return validTexts.map((text, index) => {
    const values = response.embeddings?.[index]?.values;

    if (!values) {
      throw new Error(
        `Embedding missing for text at index ${index}`
      );
    }

    return {
      text,
      embedding: values,
    };
  });
};


const generateEmbeddingForQuestion = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const embedding =
    response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error(
      "Failed to generate embedding"
    );
  }

  return embedding;
};


module.exports = {
  generateText,
  generateEmbeddings,
  generateEmbeddingForQuestion
};