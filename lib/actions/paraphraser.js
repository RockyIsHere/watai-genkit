"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paraphraserFlow = void 0;
const exports_1 = require("../exports");
const outputSchema = exports_1.z.object({
    message: exports_1.z.string(),
});
exports.paraphraserFlow = (0, exports_1.defineFlow)({
    name: "paraphraserFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: outputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As an English teacher, your task is to paraphrase the following sentence. Please rewrite the sentence in a different way while preserving its original meaning. Focus on changing the wording and structure without altering the intended message.
        Here is the sentence to be paraphrased:
       ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=paraphraser.js.map