const { PDFParse } = require("pdf-parse");
const path = require("path");
const ApiError = require("./ApiError");

const extractTextFromPDF = async (buffer) => {
    try {
        const standardFontDataUrl = path.join(
            process.cwd(),
            "node_modules",
            "pdfjs-dist",
            "standard_fonts",
            "/"
        );

        const parser = new PDFParse({
            data: new Uint8Array(buffer),
            standardFontDataUrl
        });

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