import { configureGenkit } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import generateOutput, { sendWAMessage } from "./utils";
import { grammerCheckFlow } from "./actions/grammer.check";
import multer from "multer";
import { extractText, pdfSummaryFlow } from "./actions/pdf.summary";
import { VerificationRequest, WebhookRequest } from "./webhook/_types/types";
import axios from "axios";
import dotenv from "dotenv";
import { DatabaseService, UserData } from "./service/db";
dotenv.config();
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

const app = express();
const db = new DatabaseService();

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: "uploads/" });

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

app.post("/db", async (req: Request, res: Response) => {
  const userData: UserData = {
    message: "Message",
    response: "Response",
  };
  await db.setData("001", userData);
  res.status(201).json(userData);
});

app.post(
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

app.get("/webhook", (req: VerificationRequest, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.post("/webhook", async (req: WebhookRequest, res: Response) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    const result = await generateOutput(grammerCheckFlow, message.text.body);

    await sendWAMessage(business_phone_number_id, message.from, result.message);
    const userData: UserData = {
      message: message.text.body,
      response: result.message,
    };
    if (business_phone_number_id) {
      await db.setData(business_phone_number_id, userData);
    }
  }

  res.sendStatus(200);
});

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Server is running</h1>`);
});

app.listen(PORT, () => {
  console.log("Server is listening at " + PORT);
});
