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
const core_1 = require("@genkit-ai/core");
const googleai_1 = require("@genkit-ai/googleai");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const wp_message_1 = __importStar(require("./webhook/wp.message"));
const grammer_check_1 = require("./actions/grammer.check");
const multer_1 = __importDefault(require("multer"));
const pdf_summary_1 = require("./actions/pdf.summary");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./service/db");
const tamplate_1 = __importDefault(require("./webhook/tamplate"));
const paraphraser_1 = require("./actions/paraphraser");
const synonyms_1 = require("./actions/synonyms");
const antonyms_1 = require("./actions/antonyms");
dotenv_1.default.config();
const { WEBHOOK_VERIFY_TOKEN, PORT } = process.env;
const app = (0, express_1.default)();
const db = new db_1.DatabaseService();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const upload = (0, multer_1.default)({ dest: "uploads/" });
(0, core_1.configureGenkit)({
    plugins: [(0, googleai_1.googleAI)()],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
app.post("/webhook", async (req, res) => {
    var _a, _b, _c, _d, _e;
    // Log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
    try {
        const entry = (_a = req.body.entry) === null || _a === void 0 ? void 0 : _a[0];
        const changes = (_b = entry === null || entry === void 0 ? void 0 : entry.changes) === null || _b === void 0 ? void 0 : _b[0];
        const value = changes === null || changes === void 0 ? void 0 : changes.value;
        const message = (_c = value === null || value === void 0 ? void 0 : value.messages) === null || _c === void 0 ? void 0 : _c[0];
        const businessPhoneNumberId = (_d = value === null || value === void 0 ? void 0 : value.metadata) === null || _d === void 0 ? void 0 : _d.phone_number_id;
        if (!message || !businessPhoneNumberId) {
            res.sendStatus(400);
        }
        const messageFrom = (_e = message === null || message === void 0 ? void 0 : message.from) !== null && _e !== void 0 ? _e : "";
        if ((message === null || message === void 0 ? void 0 : message.type) === "text") {
            const messageBody = message.text.body.toLowerCase();
            if (["hi", "start", "restart"].includes(messageBody)) {
                await (0, tamplate_1.default)(businessPhoneNumberId, messageFrom);
            }
            else {
                const userData = await db.getData(messageFrom);
                if (userData) {
                    let result = "";
                    switch (userData.conversationId) {
                        case "grammar_checker":
                            result = (await (0, wp_message_1.default)(grammer_check_1.grammerCheckFlow, messageBody))
                                .message;
                            break;
                        case "paraphraser":
                            result = (await (0, wp_message_1.default)(paraphraser_1.paraphraserFlow, messageBody))
                                .message;
                            break;
                        case "synonyms":
                            result = (await (0, wp_message_1.default)(synonyms_1.synonymsFlow, messageBody))
                                .message;
                            break;
                        case "antonyms":
                            result = (await (0, wp_message_1.default)(antonyms_1.antonymsFlow, messageBody))
                                .message;
                            break;
                        default:
                            result = "Invalid conversation ID";
                    }
                    await (0, wp_message_1.sendWAMessage)(businessPhoneNumberId, messageFrom, result);
                }
            }
        }
        if ((message === null || message === void 0 ? void 0 : message.type) === "button") {
            const conversationId = message.button.payload;
            const buttonName = message.button.text;
            const userData = { conversationId };
            await (0, wp_message_1.onSelectAction)(businessPhoneNumberId, messageFrom, buttonName);
            await db.setData(messageFrom, userData);
        }
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.sendStatus(500);
    }
});
app.post("/generate", async (req, res) => {
    const { input } = req.body;
    const result = await (0, wp_message_1.default)(antonyms_1.antonymsFlow, input);
    res.status(201).json(result);
});
app.post("/upload", upload.single("pdf"), async (req, res) => {
    var _a, _b;
    if (!req.file) {
        res.status(400).send("No file uploaded.");
    }
    const extractedText = await (0, pdf_summary_1.extractText)((_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "");
    const result = await (0, wp_message_1.default)(pdf_summary_1.pdfSummaryFlow, extractedText);
    res.status(201).json({ message: result.summary });
});
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    }
    else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});
app.get("/", (req, res) => {
    res.send(`<h1>Server is running</h1>`);
});
app.listen(PORT, () => {
    console.log("Server is listening at " + PORT);
});
//# sourceMappingURL=index.js.map