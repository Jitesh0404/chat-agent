

function mapParaToEmbeddings(validParagraphs, embeddings) {
    if (!Array.isArray(embeddings) || embeddings.length === 0) {
        throw new Error("Failed to generate embeddings");
    }

    if (embeddings.length !== validParagraphs.length) {
        throw new Error(
            "Embedding count does not match paragraph count"
        );
    }

    // 5. Map paragraphs to embeddings
    const data = validParagraphs.map((text, index) => ({
        chunkIndex: index,
        text,
        embedding: embeddings[index],
    }));

    return data;
}

module.exports = {
    mapParaToEmbeddings,
};
