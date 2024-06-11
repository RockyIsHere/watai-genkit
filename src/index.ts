import { configureGenkit } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import generateOutput, {
  onSelectAction,
  sendWAMessage,
} from "./webhook/wp.message";
import { grammerCheckFlow } from "./actions/grammer.check";
import multer from "multer";
import { extractText, pdfSummaryFlow } from "./actions/pdf.summary";
import { buttonType, VerificationRequest, WebhookRequest } from "./types";
import dotenv from "dotenv";
import { DatabaseService, UserData } from "./service/db";
import sendTemplate from "./webhook/tamplate";
import { paraphraserFlow } from "./actions/paraphraser";
import { synonymsFlow } from "./actions/synonyms";
import { antonymsFlow } from "./actions/antonyms";

dotenv.config();
const { WEBHOOK_VERIFY_TOKEN, PORT } = process.env;

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

app.post("/webhook", async (req: WebhookRequest, res: Response) => {
  // Log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    const businessPhoneNumberId = value?.metadata?.phone_number_id;

    if (!message || !businessPhoneNumberId) {
      res.sendStatus(400);
    }

    const messageFrom = message?.from ?? "";

    if (message?.type === "text") {
      const messageBody = message.text.body.toLowerCase();

      if (["hi", "start", "restart"].includes(messageBody)) {
        await sendTemplate(businessPhoneNumberId, messageFrom);
      } else {
        const userData: UserData | undefined = await db.getData(messageFrom);

        if (userData) {
          let result = "";

          switch (userData.conversationId) {
            case "grammar_checker":
              result = (await generateOutput(grammerCheckFlow, messageBody))
                .message;
              break;
            case "paraphraser":
              result = (await generateOutput(paraphraserFlow, messageBody))
                .message;
              break;
            case "synonyms":
              result = (await generateOutput(synonymsFlow, messageBody))
                .message;
              break;
            case "antonyms":
              result = (await generateOutput(antonymsFlow, messageBody))
                .message;
              break;
            default:
              result = "Invalid conversation ID";
          }

          await sendWAMessage(businessPhoneNumberId, messageFrom, result);
        }
      }
    }

    if (message?.type === "button") {
      const conversationId = message.button.payload as buttonType;
      const buttonName = message.button.text;

      const userData: UserData = { conversationId };
      await onSelectAction(businessPhoneNumberId, messageFrom, buttonName);
      await db.setData(messageFrom, userData);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.sendStatus(500);
  }
});

app.post("/generate", async (req: Request, res: Response) => {
  const { input } = req.body;
  const result = await sendTemplate("331837460013168", "917029406424");
  res.status(201).json(result);
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

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Server is running</h1>`);
});

app.listen(PORT, () => {
  console.log("Server is listening at " + PORT);
});
