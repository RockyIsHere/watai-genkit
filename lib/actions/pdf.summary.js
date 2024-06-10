"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = exports.pdfSummaryFlow = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf = require("pdf-parse");
const path_1 = __importDefault(require("path"));
const exports_1 = require("../exports");
const pdfSummaryOutputSchema = exports_1.z.object({
    summary: exports_1.z.string(),
});
exports.pdfSummaryFlow = (0, exports_1.defineFlow)({
    name: "pdfSummaryFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: pdfSummaryOutputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `Please summarize the following text. Focus on the main points and key details, and aim to condense the content while preserving its essential meaning. Ensure the summary is concise, clear, and coherent: ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: pdfSummaryOutputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
const extractText = async (filePath) => {
    const pdfPath = path_1.default.resolve(filePath);
    fs_1.default.readFileSync(pdfPath);
    const dataBuffer = fs_1.default.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    // Clean up the uploaded file
    fs_1.default.unlinkSync(pdfPath);
    return data.text;
};
exports.extractText = extractText;
//# sourceMappingURL=pdf.summary.js.map