import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, runFlow, startFlowsServer } from "@genkit-ai/flow";
import { geminiPro } from "@genkit-ai/googleai";
import * as z from "zod";
import { googleAI } from "@genkit-ai/googleai";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

const outputSchema = z.object({
  output: z.string(),
});

app.post("/generate", async (req: Request, res: Response) => {
  const input: string = req.body.input;
  const output: z.infer<typeof outputSchema> = await runFlow(
    grammerCheckFlow,
    input
  );
  res.status(201).json(output);
});

const grammerCheckFlow = defineFlow(
  {
    name: "grammerCheckFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As an English language expert, please review the following sentence. Correct any grammatical errors, enhance its clarity, and improve its overall readability: ${subject}`,
      model: geminiPro,
      output: { schema: outputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);

app.listen(PORT, () => {
  console.log("Server is listening at " + PORT);
});
