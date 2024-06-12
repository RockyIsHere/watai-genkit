import { defineFlow, geminiPro, generate, z } from "../exports";
import { outputSchema } from "../types";

export const englishPoemFlow = defineFlow(
  {
    name: "englishPoemFlow",
    inputSchema: z.string(),
    outputSchema: outputSchema,
  },
  async (subject): Promise<any> => {
    const llmResponse = await generate({
      prompt: `As a literature expert in English, your task is to create a six-line poem. Please ensure the poem is rich in imagery, emotion, and literary devices. The poem should reflect depth and creativity, capturing the essence of the theme provided.
      Here is the theme for the poem:
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
