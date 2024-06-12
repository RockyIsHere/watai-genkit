"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesFlow = void 0;
const exports_1 = require("../exports");
const types_1 = require("../types");
exports.quotesFlow = (0, exports_1.defineFlow)({
    name: "quotesFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: types_1.outputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As a quotes expert, your task is to generate inspiring and thought-provoking quotes on a specific topic. Please create original quotes that reflect wisdom, motivation, or insight related to the given topic. Aim for clarity and depth in your expression.
      Here is the topic:
      ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: types_1.outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=quotes.js.map