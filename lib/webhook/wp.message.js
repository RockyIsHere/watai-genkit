"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMediaFile = exports.uploadMediaToWhatsApp = exports.onSelectAction = exports.sendWAMessage = void 0;
const flow_1 = require("@genkit-ai/flow");
require("dotenv").config();
const { GRAPH_API_TOKEN, SELECT_ACTION_TEMPLATE } = process.env;
const axios_1 = __importDefault(require("axios"));
const FormData = require("form-data");
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
        url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
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
const uploadMediaToWhatsApp = async (imageData, phone_number_id) => {
    const url = `https://graph.facebook.com/v19.0/${phone_number_id}/media`;
    const headers = {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    };
    const formData = new FormData();
    formData.append("messaging_product", "whatsapp");
    formData.append("file", imageData);
    try {
        const response = await axios_1.default.post(url, formData, { headers });
        if (response.status === 200) {
            console.log("Upload successful");
            return response.data.id;
        }
        else {
            throw new Error(`Upload failed with status code ${response.status}`);
        }
    }
    catch (error) {
        throw new Error(`Error uploading file: ${error}`);
    }
};
exports.uploadMediaToWhatsApp = uploadMediaToWhatsApp;
const sendMediaFile = async (to, mediaId, phone_number_id) => {
    try {
        const data = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "image",
            image: {
                id: mediaId,
            },
        };
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: data,
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.sendMediaFile = sendMediaFile;
//# sourceMappingURL=wp.message.js.map