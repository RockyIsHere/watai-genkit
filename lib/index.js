"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@genkit-ai/core");
const googleai_1 = require("@genkit-ai/googleai");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = __importDefault(require("./utils"));
const grammer_check_1 = require("./actions/grammer.check");
const multer_1 = __importDefault(require("multer"));
const pdf_summary_1 = require("./actions/pdf.summary");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("5pObHNl8c8temlt");
const encryptedString = cryptr.encrypt("bacon");
const decryptedString = cryptr.decrypt(encryptedString);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const upload = (0, multer_1.default)({ dest: "uploads/" });
(0, core_1.configureGenkit)({
    plugins: [(0, googleai_1.googleAI)()],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
app.post("/generate", async (req, res) => {
    const input = req.body.input;
    const output = await (0, utils_1.default)(grammer_check_1.grammerCheckFlow, input);
    res.status(201).json({
        message: output.message.trim().replace(".", ""),
    });
});
app.post("/upload", upload.single("pdf"), async (req, res) => {
    var _a, _b;
    if (!req.file) {
        res.status(400).send("No file uploaded.");
    }
    const extractedText = await (0, pdf_summary_1.extractText)((_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "");
    const result = await (0, utils_1.default)(pdf_summary_1.pdfSummaryFlow, extractedText);
    res.status(201).json({ message: result.summary });
});
app.post("/encryption", async (req, res) => {
    const encryptedString = cryptr.encrypt(req.body.text);
    res.status(201).json({ message: encryptedString });
});
app.post("/decryption", async (req, res) => {
    const decryptedString = cryptr.decrypt(req.body.encryptedString);
    res.status(201).json({ message: decryptedString });
});
app.listen(PORT, () => {
    console.log("Server is listening at " + PORT);
});
//# sourceMappingURL=index.js.map