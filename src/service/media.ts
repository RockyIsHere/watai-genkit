import axios from "axios";
const fs = require("fs-extra");
import path from "path";
import { extractText } from "../actions/pdf.summary";
require("dotenv").config();

export const downloadMedia = async (mediaId: string, mediaType: string) => {
  try {
    const mediaUrlResponse = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}?phone_number_id=${process.env.PHONE_NUMBER_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        },
      }
    );

    const mediaUrl = mediaUrlResponse.data.url;
    console.log(mediaUrl);

    const mediaResponse = await axios.get(mediaUrl, {
      responseType: "stream",
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
    });

    const mediaPath = path.resolve(
      __dirname,"..",
      `${mediaId}.${getExtension(mediaType)}`
    );
    console.log(mediaPath);
    const writer = fs.createWriteStream(mediaPath);

    await mediaResponse.data.pipe(writer);
    try {
      const text = await extractText(mediaPath);
      console.log(text);
      fs.remove(mediaPath);
    } catch (error) {
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
  } catch (error) {
    console.error((error as Error).message);
  }
};

const getExtension = (mediaType: string): string => {
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
