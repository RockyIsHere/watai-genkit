import fs from "fs";
const pdf = require("pdf-parse");
import path from "path";
import { defineFlow, geminiPro, generate, z } from "../exports";


const pdfSummaryOutputSchema = z.object({
  summary: z.string(),
});



export const pdfSummaryFlow = defineFlow(
  {
    name: "pdfSummaryFlow",
    inputSchema: z.string(),
    outputSchema: pdfSummaryOutputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `Please summarize the following text. Focus on the main points and key details, and aim to condense the content while preserving its essential meaning. Ensure the summary is concise, clear, and coherent: ${subject}`,
      model: geminiPro,
      output: { schema: pdfSummaryOutputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);

export const extractText = async (filePath: string) => {
  const pdfPath = path.resolve(filePath);
  fs.readFileSync(pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  // Clean up the uploaded file
  fs.unlinkSync(pdfPath);

  return data.text;
};
