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
const ai_1 = require("@genkit-ai/ai");
const core_1 = require("@genkit-ai/core");
const flow_1 = require("@genkit-ai/flow");
const googleai_1 = require("@genkit-ai/googleai");
const z = __importStar(require("zod"));
const googleai_2 = require("@genkit-ai/googleai");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
(0, core_1.configureGenkit)({
    plugins: [
        (0, googleai_2.googleAI)(),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
});
const outputSchema = z.object({
    output: z.string(),
});
app.post("/generate", async (req, res) => {
    const input = req.body.input;
    const output = await (0, flow_1.runFlow)(grammerCheckFlow, input);
    res.status(201).json(output);
});
const grammerCheckFlow = (0, flow_1.defineFlow)({
    name: "grammerCheckFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
}, async (subject) => {
    const llmResponse = await (0, ai_1.generate)({
        prompt: `As an English language expert, please review the following sentence. Correct any grammatical errors, enhance its clarity, and improve its overall readability: ${subject}`,
        model: googleai_1.geminiPro,
        output: { schema: outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
app.listen(PORT, () => {
    console.log("Server is listening at http://localhost:" + PORT + "/todos");
});
//# sourceMappingURL=index.js.map