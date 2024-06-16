import express, { Request, Response } from "express";
import multer from "multer";
import { extractText, pdfSummaryFlow } from "../actions/pdf.summary";
import generateOutput from "../webhook/wp.message";
const router = express.Router();


const upload = multer({ dest: "uploads/" });

router.post(
  "/pdf-summary",
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
