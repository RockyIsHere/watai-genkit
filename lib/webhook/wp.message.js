"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWAMessage = void 0;
const flow_1 = require("@genkit-ai/flow");
const { GRAPH_API_TOKEN } = process.env;
const axios_1 = __importDefault(require("axios"));
async function generateOutput(llm, input) {
    return await (0, flow_1.runFlow)(llm, input);
}
exports.default = generateOutput;
async function sendWAMessage(phone_number_id, to, message) {
    await (0, axios_1.default)({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
        headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
            messaging_product: "whatsapp",
            to: to,
            text: { body: message },
        },
    });
}
exports.sendWAMessage = sendWAMessage;
//# sourceMappingURL=wp.message.js.map