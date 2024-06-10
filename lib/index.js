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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const upload = (0, multer_1.default)({ dest: "uploads/" });
(0, core_1.configureGenkit)({
    plugins: [(0, googleai_1.googleAI)()],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
app.post("/generate", async (req, res) => {
    const input = req.body.input;
    const response = await (0, utils_1.default)(grammer_check_1.grammerCheckFlow, input);
    res.status(201).json({
        message: response.message.trim().replace(".", ""),
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
app.post("/webhook", async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
    const message = (_e = (_d = (_c = (_b = (_a = req.body.entry) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.changes[0]) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.messages) === null || _e === void 0 ? void 0 : _e[0];
    if ((message === null || message === void 0 ? void 0 : message.type) === "text") {
        // extract the business number to send the reply from it
        const business_phone_number_id = (_j = (_h = (_g = (_f = req.body.entry) === null || _f === void 0 ? void 0 : _f[0].changes) === null || _g === void 0 ? void 0 : _g[0].value) === null || _h === void 0 ? void 0 : _h.metadata) === null || _j === void 0 ? void 0 : _j.phone_number_id;
        const response = await (0, utils_1.default)(grammer_check_1.grammerCheckFlow, message.text.body);
        // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: "whatsapp",
                to: message.from,
                text: { body: response.data.message.trim().replace(".", "") },
            },
        });
    }
    res.sendStatus(200);
});
app.get("/", (req, res) => {
    res.send(`<h1>Server is running</h1>`);
});
app.listen(PORT, () => {
    console.log("Server is listening at " + PORT);
});
//# sourceMappingURL=index.js.map