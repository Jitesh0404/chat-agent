const fs = require('fs');
const { PDFParse } = require('pdf-parse');


const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    // 2. Convert the Buffer into a Uint8Array 
    const uint8ArrayData = new Uint8Array(dataBuffer);
    const data = new PDFParse(uint8ArrayData);
    const result = await data.getText();
    return result.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

module.exports = {
  extractTextFromPDF,
};