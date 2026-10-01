

function getPrompt(context, message) {
    return `You are an AI assistant answering questions
about an uploaded document.

Use only the provided context to answer the
user's question.

Keep the answer short and concise, and if the answer is not available in the context,
say that the document does not contain enough
information to answer the question.

Context:
${context}

User question:
${message}`;
}

module.exports = getPrompt;