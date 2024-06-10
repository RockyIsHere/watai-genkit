"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flow_1 = require("@genkit-ai/flow");
async function generateOutput(llm, input) {
    return await (0, flow_1.runFlow)(llm, input);
}
exports.default = generateOutput;
//# sourceMappingURL=utils.js.map