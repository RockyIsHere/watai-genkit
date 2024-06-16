"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const pdf_summary_1 = require("../actions/pdf.summary");
const wp_message_1 = __importDefault(require("../webhook/wp.message"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/pdf-summary", upload.single("pdf"), async (req, res) => {
    var _a, _b;
    if (!req.file) {
        res.status(400).send("No file uploaded.");
    }
    const extractedText = await (0, pdf_summary_1.extractText)((_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "");
    const result = await (0, wp_message_1.default)(pdf_summary_1.pdfSummaryFlow, extractedText);
    res.status(201).json({ message: result.summary });
});
//# sourceMappingURL=beta.js.map