import { defineFlow, geminiPro, generate, z } from "../exports";

const grammerOutputSchema = z.object({
  message: z.string(),
});

export const grammerCheckFlow = defineFlow(
  {
    name: "grammerCheckFlow",
    inputSchema: z.string(),
    outputSchema: grammerOutputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As an English language expert, please review the following sentence. Correct any grammatical errors, enhance its clarity, and improve its overall readability: ${subject}`,
      model: geminiPro,
      output: { schema: grammerOutputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);
