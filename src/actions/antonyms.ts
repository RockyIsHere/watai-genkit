import { defineFlow, geminiPro, generate, z } from "../exports";
import { outputSchema } from "../types";

export const antonymsFlow = defineFlow(
  {
    name: "antonymsFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As an English teacher, your task is to find antonyms for the given word. Please provide a list of antonyms that can be used in place of the original word while maintaining the opposite meaning in various contexts, formatted as a comma-separated list.
      Here is the word for which you need to find antonyms:
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
