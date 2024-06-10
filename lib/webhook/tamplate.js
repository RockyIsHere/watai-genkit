"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const { GRAPH_API_TOKEN, PHONE_NUMBER_ID, TAMPLATE } = process.env;
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
};
async function sendTemplate(phone_number_id, to) {
    const url = `https://graph.facebook.com/v19.0/${phone_number_id}/messages`;
    const data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "template",
        template: {
            name: TAMPLATE || "select_utility",
            language: {
                code: "en",
            },
            components: [
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "0",
                    parameters: [
                        {
                            type: "payload",
                            payload: "grammar_checker",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "1",
                    parameters: [
                        {
                            type: "payload",
                            payload: "paraphraser",
                        },
                    ],
                },
            ],
        },
    };
    await axios_1.default
        .post(url, data, { headers })
        .then((response) => {
        console.log(response.data);
    })
        .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error.message);
    });
}
exports.default = sendTemplate;
//# sourceMappingURL=tamplate.js.map