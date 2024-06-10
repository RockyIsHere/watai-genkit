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
      prompt: `As an English teacher, I would like you to correct the grammar of the following sentence. Please provide only the corrected sentence, ensuring it adheres to standard grammatical rules.
        Here is the sentence that needs correction:
       ${subject}`,
      model: geminiPro,
      output: { schema: grammerOutputSchema },
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output();
  }
);
