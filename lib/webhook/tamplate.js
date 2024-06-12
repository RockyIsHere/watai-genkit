"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const { GRAPH_API_TOKEN, TEMPLATE } = process.env;
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
};
async function sendTemplate(phone_number_id, to) {
    const url = `https://graph.facebook.com/v19.0/${phone_number_id}/messages`;
    const template = TEMPLATE || "select_utility";
    var data = {};
    data = getActionTemplate(to, template);
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
function getActionTemplate(to, template) {
    const data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "template",
        template: {
            name: template,
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
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "2",
                    parameters: [
                        {
                            type: "payload",
                            payload: "synonyms",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "3",
                    parameters: [
                        {
                            type: "payload",
                            payload: "antonyms",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "4",
                    parameters: [
                        {
                            type: "payload",
                            payload: "qr_code_generator",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "5",
                    parameters: [
                        {
                            type: "payload",
                            payload: "english_poem",
                        },
                    ],
                },
                {
                    type: "button",
                    sub_type: "quick_reply",
                    index: "6",
                    parameters: [
                        {
                            type: "payload",
                            payload: "quotes",
                        },
                    ],
                },
            ],
        },
    };
    return data;
}
//# sourceMappingURL=tamplate.js.map