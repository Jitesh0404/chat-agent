const pool = require("../db/connectDB");

const saveDocumentChunks = async (result) => {

  for (const chunk of result.finalData.data) {
    const vector = chunk.embedding;  

    await pool.query(
      `
        INSERT INTO documents (
          original_name,
          file_size,
          chunk_index,
          text,
          embedding
        )
        VALUES ($1, $2, $3, $4, $5::vector)
      `,
      [
        result.finalData.file.originalName,
        result.finalData.file.size,
        chunk.chunkIndex,
        chunk.text,
        `[${vector.embedding.join(",")}]`,
      ]
    );
  }
};


const searchSimilarChunks = async (
  questionEmbedding,
  limit = 5
) => {
  const vector = `[${questionEmbedding.join(",")}]`;

  const result = await pool.query(
    `
      SELECT
        id,
        original_name,
        file_size,
        chunk_index,
        text,
        1 - (embedding <=> $1::vector) AS similarity
      FROM documents
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `,
    [
      vector,
      limit
    ]
  );

  return result.rows;
};

module.exports = {
  saveDocumentChunks, searchSimilarChunks,
};