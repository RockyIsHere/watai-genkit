import { defineFlow, geminiPro, generate, z } from "../exports";

const outputSchema = z.object({
  message: z.string(),
});

export const paraphraserFlow = defineFlow(
  {
    name: "paraphraserFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As an English teacher, your task is to paraphrase the following sentence. Please rewrite the sentence in a different way while preserving its original meaning. Focus on changing the wording and structure without altering the intended message.
        Here is the sentence to be paraphrased:
       ${subject}`,
      model: geminiPro,
      output: { schema: outputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);
