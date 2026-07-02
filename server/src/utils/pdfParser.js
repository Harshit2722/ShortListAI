const { PDFParse } = require("pdf-parse");
const ApiError = require("./ApiError");

const extractTextFromPDF = async (buffer) => {
    try {
        const parser = new PDFParse(new Uint8Array(buffer));

        const result = await parser.getText();

        return result.text.trim();
    } catch (error) {
        console.error("PDF parsing error:", error.message);
        throw new ApiError(500, "Failed to extract text from PDF");
    }
};

module.exports = {
    extractTextFromPDF,
};