"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grammerCheckFlow = void 0;
const exports_1 = require("../exports");
const grammerOutputSchema = exports_1.z.object({
    message: exports_1.z.string(),
});
exports.grammerCheckFlow = (0, exports_1.defineFlow)({
    name: "grammerCheckFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: grammerOutputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As an English teacher, I would like you to correct the grammar of the following sentence. Please provide only the corrected sentence, ensuring it adheres to standard grammatical rules.
        Here is the sentence that needs correction:
       ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: grammerOutputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=grammer.check.js.map