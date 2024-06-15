import multer from "multer";

import express, { Request, Response } from "express";
import generateOutput, { sendMediaFileByURL } from "../webhook/wp.message";
import { bengaliPoemFlow } from "../actions/bengali.poem";
import { extractText, pdfSummaryFlow } from "../actions/pdf.summary";
import { downloadMedia } from "../service/media";
import {
  getFacebookVideoUrl,
} from "../actions/facebook.video.download";
import * as path from "path";
import { grammerCheckFlow } from "../actions/grammer.check";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/grammer-checker", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    const result = (await generateOutput(grammerCheckFlow, input)).message;
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(400);
  }
});

router.post("/generate", async (req: Request, res: Response) => {
  const { input } = req.body;
  try {
    // const result = (await generateOutput(bengaliPoemFlow, input)).message;
    res.status(201).json({ message: input });
  } catch (error) {
    res.status(400);
  }
});

router.post(
  "/upload",
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("No file uploaded.");
    }
    const extractedText: string = await extractText(req.file?.path ?? "");

    const result = await generateOutput(pdfSummaryFlow, extractedText);
    res.status(201).json({ message: result.summary });
  }
);

router.post("/pdf-summary", async (req: Request, res: Response) => {
  const { mediaId, mediaType } = req.body;

  if (!mediaId || !mediaType) {
    res.status(400).send("mediaId and mediaType are required");
  }

  const text = await downloadMedia(mediaId, mediaType);
  // const result = await generateOutput(pdfSummaryFlow, text);

  res.status(200).json({ data: "result" });
});

router.post("/download", async (req: Request, res: Response) => {
  const { facebookLink } = req.body;

  if (!facebookLink) {
    return res.status(400).json({ error: "Facebook link is required" });
  }

  try {
    const videoUrl = await getFacebookVideoUrl(facebookLink);

    if (videoUrl) {
      // const outputFilePath = path.resolve(__dirname, "../downloaded_video.mp4");
      // await downloadFacebookVideo(videoUrl, outputFilePath);
      await sendMediaFileByURL("917029406424", videoUrl, "331837460013168");
      return res.status(200).json({ message: "Video downloaded successfully" });
    } else {
      return res.status(500).json({ error: "Failed to retrieve video URL" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while downloading the video" });
  }
});

export default router;
