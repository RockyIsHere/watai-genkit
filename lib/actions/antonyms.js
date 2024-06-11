"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.antonymsFlow = void 0;
const exports_1 = require("../exports");
const outputSchema = exports_1.z.object({
    message: exports_1.z.string(),
});
exports.antonymsFlow = (0, exports_1.defineFlow)({
    name: "antonymsFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: outputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As an English teacher, your task is to find antonyms for the given word. Please provide a list of antonyms that can be used in place of the original word while maintaining the opposite meaning in various contexts, formatted as a comma-separated list.
      Here is the word for which you need to find antonyms:
      ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=antonyms.js.map