"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSelectAction = exports.sendWAMessage = void 0;
const flow_1 = require("@genkit-ai/flow");
require("dotenv").config();
const { GRAPH_API_TOKEN, SELECT_ACTION_TEMPLATE } = process.env;
const axios_1 = __importDefault(require("axios"));
async function generateOutput(llm, input) {
    return await (0, flow_1.runFlow)(llm, input);
}
exports.default = generateOutput;
async function sendWAMessage(phone_number_id, to, message) {
    await (0, axios_1.default)({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
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
async function onSelectAction(phone_number_id, to, actionName) {
    await (0, axios_1.default)({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
        headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "template",
            template: {
                name: SELECT_ACTION_TEMPLATE,
                language: {
                    code: "en",
                },
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "text",
                                text: actionName,
                            },
                        ],
                    },
                    {
                        type: "body",
                        parameters: [
                            {
                                type: "text",
                                text: actionName,
                            },
                        ],
                    },
                ],
            },
        },
    });
}
exports.onSelectAction = onSelectAction;
//# sourceMappingURL=wp.message.js.map