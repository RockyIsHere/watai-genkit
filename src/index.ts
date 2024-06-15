import { configureGenkit } from "@genkit-ai/core";
import { googleAI } from "@genkit-ai/googleai";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import generateOutput, {
  sendMediaFileByURL,
  sendWAMessage,
} from "./webhook/wp.message";
import { grammerCheckFlow } from "./actions/grammer.check";
import { buttonType, VerificationRequest, WebhookRequest } from "./types";
import dotenv from "dotenv";
import { DatabaseService, UserData } from "./service/db";
import sendTemplate from "./webhook/tamplate";
import { paraphraserFlow } from "./actions/paraphraser";
import { synonymsFlow } from "./actions/synonyms";
import { antonymsFlow } from "./actions/antonyms";
import { generateAndUploadQRCode } from "./actions/qrcode.generator";
import { quotesFlow } from "./actions/quotes";
import { englishPoemFlow } from "./actions/english.poem";

dotenv.config();
const { WEBHOOK_VERIFY_TOKEN, PORT } = process.env;

const app = express();
const db = new DatabaseService();
import routes from "./apis/index";
import { getFacebookVideoUrl } from "./actions/facebook.video.download";

app.use(cors());
app.use(bodyParser.json());

app.use("/v1", routes);

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

app.post("/webhook", async (req: WebhookRequest, res: Response) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  const businessPhoneNumberId =
    req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

  if (message?.type === "text") {
    const messageBody = message.text.body;
    const messageFrom = message.from;

    if (["hi", "start", "restart"].includes(messageBody)) {
      await sendTemplate(businessPhoneNumberId, messageFrom);
    } else {
      const userData: UserData | undefined = await db.getData(messageFrom);
      if (userData && businessPhoneNumberId) {
        try {
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
            case "english_poem":
              result = (await generateOutput(englishPoemFlow, messageBody))
                .message;
              break;
            case "quotes":
              result = (await generateOutput(quotesFlow, messageBody)).message;
              break;
            case "facebook_video_downloder":
              const videoUrl = await getFacebookVideoUrl(messageBody);

              await sendMediaFileByURL(
                messageFrom,
                videoUrl,
                businessPhoneNumberId
              );
              break;
            case "qr_code_generator":
              await generateAndUploadQRCode(
                messageBody,
                messageFrom,
                businessPhoneNumberId
              );
              result = `QRCode is generated for this given text: *${messageBody}*`;
              break;
            default:
              result = "Invalid conversation ID";
          }
        } catch (error) {
          await sendWAMessage(
            businessPhoneNumberId,
            messageFrom,
            "Please try again; there was a mistake on our end."
          );
        }
      }
    }
  }
  if (message?.type === "button") {
    const conversationId = message.button.payload as buttonType;
    const messageFrom = message.from;
    const buttonName = message.button.text;
    const userData: UserData = {
      conversationId,
    };
    // await onSelectAction(businessPhoneNumberId, messageFrom, buttonName);
    await db.setData(messageFrom, userData);
  }
  res.sendStatus(200);
});

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
