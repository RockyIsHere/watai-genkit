"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishPoemFlow = void 0;
const exports_1 = require("../exports");
const types_1 = require("../types");
exports.englishPoemFlow = (0, exports_1.defineFlow)({
    name: "englishPoemFlow",
    inputSchema: exports_1.z.string(),
    outputSchema: types_1.outputSchema,
}, async (subject) => {
    const llmResponse = await (0, exports_1.generate)({
        prompt: `As a literature expert in English, your task is to create a six-line poem. Please ensure the poem is rich in imagery, emotion, and literary devices. The poem should reflect depth and creativity, capturing the essence of the theme provided.
      Here is the theme for the poem:
      ${subject}`,
        model: exports_1.geminiPro,
        output: { schema: types_1.outputSchema },
        config: {
            temperature: 1,
        },
    });
    return llmResponse.output();
});
//# sourceMappingURL=english.poem.js.map