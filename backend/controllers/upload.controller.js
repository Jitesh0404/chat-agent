const { saveDocumentChunks } = require("../dbFunctions/document");
const { generateEmbeddings } = require("../services/llm.service");
const { extractCosineSimilarity } = require("../utils/extractCosineSimilarity");
const { extractTextFromPDF } = require("../utils/extractTextFromPDF");
const { mapParaToEmbeddings } = require("../utils/mapParaToEmbeddings");
const { splitIntoParagraphs } = require("../utils/splitIntoParagraphs");



const fs = require("fs/promises");

const uploadPdf = async (req, res) => {
    let filePath;

    try {
        // 1. Validate file
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        filePath = req.file.path;

        if (req.file.mimetype !== "application/pdf") {
            throw new Error("Only PDF files are allowed");
        }

        // 2. Extract text
        const extractedText = await extractTextFromPDF(filePath);

        if (
            typeof extractedText !== "string" ||
            extractedText.trim().length === 0
        ) {
            throw new Error("Failed to extract text from PDF");
        }

        // 3. Split text into paragraphs/chunks
        const paragraphs = await splitIntoParagraphs(extractedText);

        if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
            throw new Error("Failed to split text into paragraphs");
        }

        // Remove empty paragraphs
        const validParagraphs = paragraphs.filter(
            (paragraph) =>
                typeof paragraph === "string" &&
                paragraph.trim().length > 0
        );

        if (validParagraphs.length === 0) {
            throw new Error("No valid paragraphs found in PDF");
        }

        // 4. Generate embeddings
        const embeddings = await generateEmbeddings(validParagraphs);

        console.log("leng --- ",embeddings[0].embedding.length);
        

        if (!Array.isArray(embeddings) || embeddings.length === 0) {
            throw new Error("Failed to generate embeddings");
        }

        if (embeddings.length !== validParagraphs.length) {
            throw new Error(
                "Embedding count does not match paragraph count"
            );
        }

        // // 5. Map paragraphs to embeddings
        // const data = validParagraphs.map((text, index) => ({
        //     chunkIndex: index,
        //     text,
        //     embedding: embeddings[index],
        // }));

        const data = mapParaToEmbeddings(validParagraphs, embeddings);

        for (let i=0; i< data.length - 1; i++) {
            const similarity = extractCosineSimilarity(
                data[i].embedding,
                data[i + 1].embedding
            );
            data[i].similarityWithNext = similarity;
        }


        const finalData = {
            message: "PDF processed successfully",
            file: {
                originalName: req.file.originalname,
                size: req.file.size,
            },
            chunksProcessed: data.length,
            data,
        }

        await saveDocumentChunks({
            finalData
        });

        return res.status(200).json(finalData);

    } catch (error) {
        console.error("Error uploading PDF:", error);

        return res.status(500).json({
            message: "Error uploading PDF",
            error: error.message,
        });

    } finally {
        // Delete temporary uploaded file
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error("Failed to delete temporary PDF:", error);
            }
        }
    }
};


module.exports = {
    uploadPdf,
};