"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.synonymsFlow = void 0;
const exports_1 = require("../exports");
const outputSchema = exports_1.z.object({
    message: exports_1.z.string(),
});
exports.synonymsFlow = (0, exports_1.defineFlow)({
    name: "synonymsFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: outputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As an English teacher, your task is to find synonyms for the given word. Please provide a list of synonyms that can be used in place of the original word while maintaining the same meaning in various contexts, formatted as a comma-separated list.
      Here is the word for which you need to find synonyms: 
      ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=synonyms.js.map