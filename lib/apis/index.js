"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const wp_message_1 = __importStar(require("../webhook/wp.message"));
const pdf_summary_1 = require("../actions/pdf.summary");
const media_1 = require("../service/media");
const facebook_video_download_1 = require("../actions/facebook.video.download");
const grammer_check_1 = require("../actions/grammer.check");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/grammer-checker", async (req, res) => {
    const { input } = req.body;
    try {
        const result = (await (0, wp_message_1.default)(grammer_check_1.grammerCheckFlow, input)).message;
        res.status(201).json({ message: result });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/generate", async (req, res) => {
    const { input } = req.body;
    try {
        // const result = (await generateOutput(bengaliPoemFlow, input)).message;
        res.status(201).json({ message: input });
    }
    catch (error) {
        res.status(400);
    }
});
router.post("/upload", upload.single("pdf"), async (req, res) => {
    var _a, _b;
    if (!req.file) {
        res.status(400).send("No file uploaded.");
    }
    const extractedText = await (0, pdf_summary_1.extractText)((_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "");
    const result = await (0, wp_message_1.default)(pdf_summary_1.pdfSummaryFlow, extractedText);
    res.status(201).json({ message: result.summary });
});
router.post("/pdf-summary", async (req, res) => {
    const { mediaId, mediaType } = req.body;
    if (!mediaId || !mediaType) {
        res.status(400).send("mediaId and mediaType are required");
    }
    const text = await (0, media_1.downloadMedia)(mediaId, mediaType);
    // const result = await generateOutput(pdfSummaryFlow, text);
    res.status(200).json({ data: "result" });
});
router.post("/download", async (req, res) => {
    const { facebookLink } = req.body;
    if (!facebookLink) {
        return res.status(400).json({ error: "Facebook link is required" });
    }
    try {
        const videoUrl = await (0, facebook_video_download_1.getFacebookVideoUrl)(facebookLink);
        if (videoUrl) {
            // const outputFilePath = path.resolve(__dirname, "../downloaded_video.mp4");
            // await downloadFacebookVideo(videoUrl, outputFilePath);
            await (0, wp_message_1.sendMediaFileByURL)("917029406424", videoUrl, "331837460013168");
            return res.status(200).json({ message: "Video downloaded successfully" });
        }
        else {
            return res.status(500).json({ error: "Failed to retrieve video URL" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while downloading the video" });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map