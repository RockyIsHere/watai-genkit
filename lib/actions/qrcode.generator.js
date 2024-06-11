"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndUploadQRCode = void 0;
const QRCode = __importStar(require("qrcode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const wp_message_1 = require("../webhook/wp.message");
const generateAndUploadQRCode = async (text, to, phone_number_id) => {
    const outputPath = path.join(__dirname, `qrcode.png`);
    const imageData = fs.createReadStream(outputPath);
    try {
        await generateQrCode(text, outputPath);
        const mediaId = await (0, wp_message_1.uploadMediaToWhatsApp)(imageData, phone_number_id);
        await (0, wp_message_1.sendMediaFile)(to, mediaId, phone_number_id);
    }
    catch (err) {
        console.error(err.message);
    }
};
exports.generateAndUploadQRCode = generateAndUploadQRCode;
const generateQrCode = async (text, outputPath) => {
    try {
        await QRCode.toFile(outputPath, text);
        console.log("QR Code generated successfully.");
    }
    catch (err) {
        throw new Error(`Failed to generate QR code: ${err.message}`);
    }
};
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("File deleted successfully:", filePath);
        }
        else {
            console.log("File not found, nothing to delete:", filePath);
        }
    }
    catch (err) {
        throw new Error(`Failed to delete file: ${err.message}`);
    }
};
//# sourceMappingURL=qrcode.generator.js.map