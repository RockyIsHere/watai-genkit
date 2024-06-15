"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMedia = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = require("fs-extra");
const path_1 = __importDefault(require("path"));
const pdf_summary_1 = require("../actions/pdf.summary");
require("dotenv").config();
const downloadMedia = async (mediaId, mediaType) => {
    try {
        const mediaUrlResponse = await axios_1.default.get(`https://graph.facebook.com/v19.0/${mediaId}?phone_number_id=${process.env.PHONE_NUMBER_ID}`, {
            headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
            },
        });
        const mediaUrl = mediaUrlResponse.data.url;
        console.log(mediaUrl);
        const mediaResponse = await axios_1.default.get(mediaUrl, {
            responseType: "stream",
            headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
            },
        });
        const mediaPath = path_1.default.resolve(__dirname, "..", `${mediaId}.${getExtension(mediaType)}`);
        console.log(mediaPath);
        const writer = fs.createWriteStream(mediaPath);
        await mediaResponse.data.pipe(writer);
        try {
            const text = await (0, pdf_summary_1.extractText)(mediaPath);
            console.log(text);
            fs.remove(mediaPath);
        }
        catch (error) {
            console.log(error);
            // fs.remove(mediaPath);
        }
        // const text = await extractText(mediaPath);
        // console.log(text);
        // return text;
        // fs.unlink(mediaPath, (err: any) => {
        //   if (err) {
        //     console.error(`Failed to delete media: ${err.message}`);
        //   } else {
        //     console.log(`Deleted media: ${mediaPath}`);
        //   }
        // });
    }
    catch (error) {
        console.error(error.message);
    }
};
exports.downloadMedia = downloadMedia;
const getExtension = (mediaType) => {
    switch (mediaType) {
        case "image":
            return "jpg";
        case "video":
            return "mp4";
        case "audio":
            return "mp3";
        case "document":
            return "pdf";
        default:
            return "bin";
    }
};
//# sourceMappingURL=media.js.map