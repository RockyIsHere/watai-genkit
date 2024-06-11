import * as QRCode from "qrcode";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import FormData = require("form-data");
import { sendMediaFile, uploadMediaToWhatsApp } from "../webhook/wp.message";

export const generateAndUploadQRCode = async (
  text: string,
  to: string,
  phone_number_id: string
) => {
  const outputPath = path.join(__dirname, `qrcode.png`);
  const imageData: any = fs.createReadStream(outputPath);

  try {
    await generateQrCode(text, outputPath);
    const mediaId = await uploadMediaToWhatsApp(imageData, phone_number_id);
    await sendMediaFile(to, mediaId, phone_number_id);
  } catch (err: any) {
    console.error(err.message);
  }
};

const generateQrCode = async (
  text: string,
  outputPath: string
): Promise<void> => {
  try {
    await QRCode.toFile(outputPath, text);
    console.log("QR Code generated successfully.");
  } catch (err: any) {
    throw new Error(`Failed to generate QR code: ${err.message}`);
  }
};

const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully:", filePath);
    } else {
      console.log("File not found, nothing to delete:", filePath);
    }
  } catch (err: any) {
    throw new Error(`Failed to delete file: ${err.message}`);
  }
};
